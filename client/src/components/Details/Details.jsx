import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../redux/productsSlice';
import './Details.css';

export default function Details() {
  const { id } = useParams();
  const dispatch = useDispatch();

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

  if (!product) return <p>Buscando producto...</p>;

  return (
    <div className="Details">
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
        <p><strong>Serie:</strong> {product.serie}</p>
        <p><strong>Edición:</strong> {product.edicion}</p>
        <p><strong>Tema:</strong> {product.tema}</p>
        <p><strong>Venta:</strong> S/. {product.venta}</p>
        <p><strong>Disponibilidad:</strong> {product.disponibilidad}</p>
        <p><strong>Rareza:</strong> {product.rareza}</p>
      </div>
    </div>
  );
}
