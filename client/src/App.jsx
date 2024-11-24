import axios from 'axios';
import MainRoutes from './components/main-routes.component.jsx';
import { WebSocketContextProvider } from './context/WebsocketContext.context.jsx';
import { ConversationContextProvider } from './context/ConversationContext.context.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import React from 'react';
function App() {
  axios.defaults.baseURL = 'http://localhost:4040'
  axios.defaults.withCredentials = true;
  
  return (
    <Provider store={store}>
      <ConversationContextProvider>
        <WebSocketContextProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainRoutes></MainRoutes>}/>
            </Routes>
          </Router>
        </WebSocketContextProvider>
      </ConversationContextProvider>
    </Provider>
  )
}

export default App
