import axios from 'axios';
import MainRoutes from './components/main-routes.component.jsx';
import { UserContextProvider } from './context/UserContext.context.jsx';
import { WebSocketContextProvider } from './context/WebsocketContext.context.jsx';
import { ConversationContextProvider } from './context/ConversationContext.context.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  axios.defaults.baseURL = 'http://localhost:4040'
  axios.defaults.withCredentials = true;
  
  return (
    <UserContextProvider>
      <ConversationContextProvider>
        <WebSocketContextProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainRoutes></MainRoutes>}/>
            </Routes>
          </Router>
        </WebSocketContextProvider>
      </ConversationContextProvider>
    </UserContextProvider>
  )
}

export default App
