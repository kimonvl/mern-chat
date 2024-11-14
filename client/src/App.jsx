import axios from 'axios';
import MainRoutes from './components/main-routes.component.jsx';
import { UserContextProvider } from './context/UserContext.context.jsx';
import { WebSocketContextProvider } from './context/WebsocketContext.context.jsx';




function App() {
  axios.defaults.baseURL = 'http://localhost:4040'
  axios.defaults.withCredentials = true;
  
  return (
    <UserContextProvider>
      <WebSocketContextProvider>
        <MainRoutes></MainRoutes>
      </WebSocketContextProvider>
    </UserContextProvider>
  )
}

export default App
