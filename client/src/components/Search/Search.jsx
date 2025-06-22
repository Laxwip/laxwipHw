import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts } from '../../redux/productsSlice';
import { Link } from 'react-router-dom';
import './Search.css';

export default function Search() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const { searchResults, status, error } = useSelector((state) => state.products);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() !== '') {
      dispatch(searchProducts(value));
    } else {
      dispatch({ type: 'products/clearSearchResults' });
    }
  };


  return (
    <div className="Search">
      <div className="searchBar">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Buscar producto..."
        />
      </div>

      {status === 'loading' && (
        <img className="productsContainerCharging" src="https://i.gifer.com/ZKZg.gif" alt="Cargando..." />
      )}
      {status === 'failed' && <p>Error: {error}</p>}

      <div className="results">
        {status === 'succeeded' && searchResults.length === 0 && <p>No se encontraron resultados.</p>}
        {status === 'succeeded' && searchResults.length > 0 &&
          searchResults.map((item, i) => (
            <span key={i}>
              <Link to={`/details/${item.id}`}>
                <img src={item.archivos?.[0] || 'https://res.cloudinary.com/dpk2wmbsb/image/upload/v1740155576/no-image-icon-23485_bc5oyn.png'} alt={item.nombre} />
                <p><strong>{item.nombre}</strong></p>
                <p>{item.serie} {item.edicion}</p>
              </Link>
            </span>
          ))
        }
      </div>
    </div>
  );
}
