import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Details.css';

export default function Details() {
  const { id } = useParams();
  const product = useSelector((state) =>
    state.products.items.find((item) => item.id === id)
  );

  if (!product) return <p>Producto no encontrado.</p>;

  return (
    <div className="Details">
      <h2>{product.nombre}</h2>
      <img
        src={product.archivos[0] || "https://res.cloudinary.com/dpk2wmbsb/image/upload/v1740155576/no-image-icon-23485_bc5oyn.png"}
        alt=""
      />
      <p><strong>Serie:</strong> {product.serie}</p>
      <p><strong>Edición:</strong> {product.edicion}</p>
      <p><strong>Tema:</strong> {product.tema}</p>
      <p><strong>Venta:</strong> S/. {product.venta}</p>
      <p><strong>Disponibilidad:</strong> {product.disponibilidad}</p>
      <p><strong>Rareza:</strong> {product.rareza}</p>
    </div>
  );
}
