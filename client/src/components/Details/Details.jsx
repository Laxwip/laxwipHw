import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductById,
  deleteProductById,
  updateProductById
} from '../../redux/productsSlice';
import './Details.css';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOptions, setShowOptions] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);

  const { items, searchResults, selectedProduct } = useSelector((state) => state.products);

  const product =
    items.find((item) => item.id === id) ||
    searchResults.find((item) => item.id === id) ||
    selectedProduct;

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!product) {
      dispatch(fetchProductById(id));
    } else {
      setFormData({ ...product });
    }
  }, [dispatch, id, product]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteProductById(id));
      setDeleted(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      alert('Error eliminando producto');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked, multiple, options } = e.target;
    if (multiple) {
      const selected = [...options].filter(o => o.selected).map(o => o.value);
      setFormData(prev => ({ ...prev, [name]: selected }));
    } else {
      if (name === 'tematico' && !checked) {
        setFormData(prev => ({ ...prev, tematico: false, tema: '' }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        }));
      }
    }
  };

  const handleEditSubmit = async () => {
    setEditing(true);
    const finalData = {
      ...formData,
      venta: parseFloat(formData.venta),
    };
    if (!formData.tematico) delete finalData.tema;

    try {
      await dispatch(updateProductById({ id, data: finalData }));
      setShowEditModal(false);
      navigate(0);
    } catch (err) {
      alert('Error actualizando producto');
    } finally {
      setEditing(false);
    }
  };

  const loteOptions = ['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q'];

  if (!product) return <p>Buscando producto...</p>;

  return (
    <div className="Details">
      <div className='detailsBottonOptions' onClick={() => setShowOptions(!showOptions)}>
        <img src="/options2.png" alt="" className='imgIcons' />
        {showOptions && (
          <div className='optionsMenu'>
            <div onClick={() => setShowEditModal(true)}>Editar</div>
            <div className='danger' onClick={() => setShowConfirmModal(true)}>Eliminar</div>
          </div>
        )}
      </div>

      <img
        src={product.archivos?.[0] || "https://res.cloudinary.com/dpk2wmbsb/image/upload/v1740155576/no-image-icon-23485_bc5oyn.png"}
        alt=""
        className='imgPrincipal'
      />
      <h2>{product.nombre}</h2>
      <div className='hr'></div>
      <div className='detailsDatos'>
        <div><span><img src="/disponibilidad.png" alt="" className='imgIcons' /></span>{product.disponibilidad}</div>
        <div><span><img src="/serie.png" alt="" className='imgIcons' /></span>{product.serie}</div>
        <div><span><img src="/edicion.png" alt="" className='imgIcons' /></span>{product.edicion}</div>
        <div><span><img src="/numeroSerie.png" alt="" className='imgIcons' /></span>{product.numero} / 250</div>
        <div><span><img src="/numeroSubSerie.png" alt="" className='imgIcons' /></span>{product.numeroDoble}</div>
        {product.tematico && product.tema && (
          <div><span><img src="/tema.png" alt="" className='imgIcons' /></span>{product.tema}</div>
        )}
        <div><span><img src="/rareza.png" alt="" className='imgIcons' /></span>{product.rareza}</div>
        <div><span><img src="/ventas.png" alt="" className='imgIcons' /></span>{product.venta}</div>
        {Array.isArray(product.lote) && product.lote.length > 0 && (
          <div>
            <span><img src="/lote.png" alt="" className='imgIcons' /></span>
            {product.lote.map((lote, index) => (
              <span key={index} className="lote-tag">{lote}</span>
            ))}
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {deleted ? (
              <p className="success-check">✔ Producto eliminado</p>
            ) : deleting ? (
              <p className="loading-spinner">Eliminando...</p>
            ) : (
              <>
                <p>¿Estás seguro de que deseas eliminar este producto?</p>
                <div className="modal-actions">
                  <button className="danger" onClick={handleDelete}>Borrar</button>
                  <button onClick={() => setShowConfirmModal(false)}>Cancelar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showEditModal && (
        <div className="modal-overlay full">
          <div className="modal-content edit">
            <h3>Editar Producto</h3>
            <form className="formulario" onSubmit={(e) => { e.preventDefault(); handleEditSubmit(); }}>
              <input
                name="nombre"
                placeholder="Nombre"
                type='text'
                value={formData.nombre ?? ''}
                onChange={handleEditChange}
                className={(formData.nombre ?? '') !== '' ? 'filled' : ''}
              />

              <input
                name="serie"
                placeholder="Serie"
                type='text'
                value={formData.serie ?? ''}
                onChange={handleEditChange}
                className={(formData.serie ?? '') !== '' ? 'filled' : ''}
              />

              <input name="numero" placeholder="#" value={formData.numero || ''} onChange={handleEditChange} type="number" className={formData.numero ? 'filled' : ''} />
              <input name="numeroDoble" placeholder="##" value={formData.numeroDoble || ''} onChange={handleEditChange} type="number" className={formData.numeroDoble ? 'filled' : ''} />

              <select name="disponibilidad" value={formData.disponibilidad || ''} onChange={handleEditChange} className={formData.disponibilidad ? 'filled' : ''}>
                <option value="">Disponibilidad</option>
                <option value="Disponible">Disponible</option>
                <option value="No Disponible">No Disponible</option>
                <option value="Sin Obtener">Sin Obtener</option>
              </select>

              <select name="edicion" value={formData.edicion || ''} onChange={handleEditChange} className={formData.edicion ? 'filled' : ''}>
                <option value="">Edición</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>

              <div className="lote-container">
                <select onChange={(e) => {
                  const selected = e.target.value;
                  if (selected && (!formData.lote || !formData.lote.includes(selected))) {
                    setFormData((prev) => ({ ...prev, lote: [...(prev.lote || []), selected] }));
                  }
                  e.target.value = '';
                }}>
                  <option value="">Lote</option>
                  {loteOptions.map(letter => (
                    <option key={letter} value={letter}>{letter}</option>
                  ))}
                </select>

                <div className="lote-tags">
                  {formData.lote?.map((l, idx) => (
                    <span key={idx} className="lote-tag">
                      {l} <button type="button" onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          lote: prev.lote.filter((v) => v !== l),
                        }));
                      }}>✖</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="tematico-container">
                <label className="checkbox-label">
                  <input name="tematico" type="checkbox" checked={formData.tematico || false} onChange={handleEditChange} />
                  <span className="custom-checkbox"></span>
                </label>
                <input name="tema" placeholder="Tema (Opcional)" value={formData.tema || ''} type="text" onChange={handleEditChange} disabled={!formData.tematico} className={formData.tema ? 'filled' : ''} />
              </div>

              <select name="rareza" value={formData.rareza || ''} onChange={handleEditChange} className={formData.rareza ? 'filled' : ''}>
                <option value="">Rareza</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Recolor">Recolor</option>
                <option value="TH">TH</option>
                <option value="STH">STH</option>
              </select>

              <input name="venta" placeholder="Precio de venta" value={formData.venta || ''} onChange={handleEditChange} type="number" className={formData.venta ? 'filled' : ''} />

              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>Cancelar</button>
                <button type="submit" disabled={editing}>{editing ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
