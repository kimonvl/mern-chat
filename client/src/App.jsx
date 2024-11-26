import axios from 'axios';
import MainRoutes from './components/main-routes.component.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import React from 'react';
function App() {
  axios.defaults.baseURL = 'http://localhost:4040'
  axios.defaults.withCredentials = true;
  
  return (
    <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<MainRoutes></MainRoutes>}/>
          </Routes>
        </Router>
    </Provider>
  )
}

export default App
