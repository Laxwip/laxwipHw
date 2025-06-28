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
      </div>
    </div>
  );
}
