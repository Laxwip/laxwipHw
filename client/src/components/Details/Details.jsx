import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, deleteProductById } from '../../redux/productsSlice';
import './Details.css';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOptions, setShowOptions] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const { items, searchResults, selectedProduct } = useSelector((state) => state.products);

  const product =
    items.find((item) => item.id === id) ||
    searchResults.find((item) => item.id === id) ||
    selectedProduct;

  useEffect(() => {
    if (!product) {
      dispatch(fetchProductById(id));
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

  if (!product) return <p>Buscando producto...</p>;

  return (
    <div className="Details">
      <div className='detailsBottonOptions' onClick={() => setShowOptions(!showOptions)}>
        <img src="/options2.png" alt="" className='imgIcons' />
        {showOptions && (
          <div className='optionsMenu'>
            <div onClick={() => alert('Función editar pendiente')}>Editar</div>
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
        <div>
          <span>
            <img src="/disponibilidad.png" alt="" className='imgIcons' />
          </span>
          {product.disponibilidad}
        </div>
        <div>
          <span>
            <img src="/serie.png" alt="" className='imgIcons'/>
          </span>
          {product.serie}
        </div>
        <div>
          <span>
            <img src="/edicion.png" alt="" className="imgIcons" />
          </span>
          {product.edicion}
        </div>
        <div>
          <span>
            <img src="/numeroSerie.png" alt="" className='imgIcons' />
          </span>
          {product.numero} / 250
        </div>
        <div>
          <span>
            <img src="/numeroSubSerie.png" alt="" className='imgIcons'/>
          </span>
          {product.numeroDoble}
        </div>
        {product.tematico && product.tema && (
          <div>
            <span>
              <img src="/tema.png" alt="" className='imgIcons' />
            </span>
            {product.tema}
          </div>
        )}
        <div>
          <span>
            <img src="/rareza.png" alt="" className='imgIcons' />
          </span>
          {product.rareza}
        </div>
        <div>
          <span>
            <img src="/ventas.png" alt="" className='imgIcons' />
          </span>
          {product.venta}
        </div>
        {Array.isArray(product.lote) && product.lote.length > 0 && (
          <div>
            <span>
              <img src="/lote.png" alt="" className="imgIcons" />
            </span>
            {product.lote.map((lote, index) => (
              <span key={index} className="loteTag">
                {lote}
              </span>
            ))}
          </div>
        )}
      </div>

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {deleting ? (
              deleted ? (
                <p className="success-check">✔ Producto eliminado</p>
              ) : (
                <p className="loading-spinner">Eliminando...</p>
              )
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
    </div>
  );
}
