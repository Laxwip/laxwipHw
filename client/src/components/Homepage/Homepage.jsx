import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/productsSlice';
import { Link } from 'react-router-dom'; // ✅ Importa Link
import './Homepage.css';

export default function Homepage() {
  const dispatch = useDispatch();
  const { homepageItems, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="Homepage">
      {status === 'loading' && (
        <img
          className="productsContainerCharging"
          src="https://i.gifer.com/ZKZg.gif"
          alt="Cargando..."
        />
      )}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && homepageItems.length === 0 && (
        <p>No hay productos disponibles.</p>
      )}
      {status === 'succeeded' && homepageItems.length > 0 && (
        <div>
          {homepageItems.map((item, i) => (
            <span key={i}>
              <Link to={`/details/${item.id}`}>
                <img src={item.archivos[0] || 'https://res.cloudinary.com/dpk2wmbsb/image/upload/v1740155576/no-image-icon-23485_bc5oyn.png'} alt="" />
                <p><strong>{item.nombre}</strong></p>
                <p>{item.serie} {item.edicion}</p>
              </Link>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
