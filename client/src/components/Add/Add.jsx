import React, { useState } from 'react';
import axios from 'axios';
import './Add.css';

const initialState = {
  nombre: '',
  disponibilidad: '',
  numeroDoble: '',
  numero: '',
  serie: '',
  edicion: '',
  lote: [],
  tema: '',
  rareza: '',
  venta: '',
  tematico: false,
  archivos: [],
};

export default function Add() {
  const [form, setForm] = useState(initialState);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, multiple, options } = e.target;

    if (multiple) {
      const selected = [...options].filter(o => o.selected).map(o => o.value);
      setForm(prev => ({ ...prev, [name]: selected }));
    } else {
      if (name === 'tematico' && !checked) {
        // si se desactiva el checkbox, borra el tema
        setForm(prev => ({ ...prev, tematico: false, tema: '' }));
      } else {
        setForm(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        }));
      }
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'laxwipHw');

    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dpk2wmbsb/image/upload', data);
      const imageUrl = res.data.secure_url;
      setForm((prev) => ({
        ...prev,
        archivos: [imageUrl],
      }));
    } catch (err) {
      console.error('Error subiendo imagen:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...form,
      venta: parseFloat(form.venta),
    };

    // Si no es temático, eliminar el campo 'tema'
    if (!form.tematico) {
      delete finalData.tema;
    }

    console.log('🟡 Datos enviados al backend:', finalData); // 👈 Esto te muestra los datos en consola

    try {
      await axios.post('https://laxwiphw.onrender.com/createProducto', finalData);
      setShowModal(true);
      setForm(initialState);
    } catch (err) {
      console.error('🔴 Error al guardar el producto:', err);
      alert('Error al guardar el producto');
    }
  };



  const isFormComplete = () => {
    const requiredFields = [
      'nombre',
      'disponibilidad',
      'numeroDoble',
      'numero',
      'serie',
      'edicion',
      'rareza',
      'venta',
      'lote' // aseguramos que tenga al menos un lote seleccionado
    ];

    if (form.tematico) {
      requiredFields.push('tema'); // tema es obligatorio solo si es temático
    }

    const allFieldsFilled = requiredFields.every((field) =>
      Array.isArray(form[field])
        ? form[field].length > 0
        : form[field].toString().trim() !== ''
    );

    const imageUploaded = form.archivos.length > 0;

    return allFieldsFilled && imageUploaded;
  };




  const loteOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q'];

  return (
    <div className="Add">
      <form className="formulario" onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} type='text' onChange={handleChange} className={form.nombre ? 'filled' : ''}/>

        <input name="serie" placeholder="Serie" value={form.serie} type="text" onChange={handleChange} className={form.serie ? 'filled' : ''}/>

        <input name="numero" placeholder="#" value={form.numero} type='number' onChange={handleChange} className={form.numero ? 'filled' : ''}/>
        <input name="numeroDoble" placeholder="##" value={form.numeroDoble} type='number' onChange={handleChange} className={form.numeroDoble ? 'filled' : ''} />

        <select name="disponibilidad" value={form.disponibilidad} onChange={handleChange}
        className={form.disponibilidad ? 'filled' : ''}>
          <option value="">Disponibilidad</option>
          <option value="Disponible">Disponible</option>
          <option value="No Disponible">No Disponible</option>
          <option value="Sin Obtener">Sin Obtener</option>
        </select>



        <select
          name="edicion"
          value={form.edicion}
          onChange={handleChange}
          className={form.edicion ? 'filled' : ''}
        >
          <option value="">Edición</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select>


        <div className="lote-container">
          <select onChange={(e) => {
            const selected = e.target.value;
            if (selected && !form.lote.includes(selected)) {
              setForm((prev) => ({
                ...prev,
                lote: [...prev.lote, selected],
              }));
            }
            e.target.value = ''; // reset selector
          }}>
            <option value="">Lote</option>
            {loteOptions.map((letter) => (
              <option key={letter} value={letter}>
                {letter}
              </option>
            ))}
          </select>

          <div className="lote-tags">
            {form.lote.map((l, idx) => (
              <span key={idx} className="lote-tag">
                {l} <button type="button" onClick={() => {
                  setForm((prev) => ({
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
            <input
              name="tematico"
              type="checkbox"
              checked={form.tematico}
              onChange={handleChange}
            />
            <span className="custom-checkbox"></span>
          </label>

          <input
            name="tema"
            placeholder="Tema (Opcional)"
            value={form.tema}
            type="text"
            onChange={handleChange}
            disabled={!form.tematico}
            className={form.tema ? 'filled' : ''}
          />
        </div>



        <select name="rareza" value={form.rareza} onChange={handleChange}
        className={form.disponibilidad ? 'filled' : ''}>
          <option value="">Rareza</option>
          <option value="Comun">Comun</option>
          <option value="Recolor">Recolor</option>
          <option value="Nuevo">Nuevo</option>
          <option value="TH">TH</option>
          <option value="STH">STH</option>
        </select>

        <input
          name="venta"
          placeholder="Precio de venta"
          value={form.venta}
          onChange={handleChange}
          type="number"
          className={form.venta ? 'filled' : ''}
        />

        <div className="file-upload">
  <label htmlFor="fileInput" className="file-button">
    Subir Imagen
  </label>
  <input
    id="fileInput"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
  />
</div>


        {uploading && <p>Subiendo imagen...</p>}
        {form.archivos.length > 0 && (
          <img src={form.archivos[0]} alt="preview" style={{ width: '100px', marginTop: '0.5rem' }} />
        )}

        <button type="submit" disabled={!isFormComplete() || uploading}>
          Guardar Producto
        </button>
      </form>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Producto guardado correctamente.</p>
            <button onClick={() => setShowModal(false)}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}
