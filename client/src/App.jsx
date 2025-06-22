import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Homepage from "./components/Homepage/Homepage";
import Add from "./components/Add/Add";
import Options from "./components/Options/Options";
import Search from "./components/Search/Search";
import SearchVentas from "./components/SearchVentas/SearchVentas";
import Ventas from "./components/Ventas/Ventas";
import Details from "./components/Details/Details";
import './App.css';

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/add' element={<Add />} />
          <Route path='/options' element={<Options />} />
          <Route path='/search' element={<Search />} />
          <Route path='/search-ventas' element={<SearchVentas />} />
          <Route path='/ventas' element={<Ventas />} />
          <Route path='/details/:id' element={<Details />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
