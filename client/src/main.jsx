import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";  
import { Provider } from 'react-redux'
import store from '../redux/store.js';
import { AuthProvider } from './context/AuthProvider.jsx';
import { ChatProvider } from './context/ChatProvider.jsx';
import { MessageProvider } from './context/MessageProvider.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider>
      <ChatProvider>
      <MessageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MessageProvider>
      </ChatProvider>
    </AuthProvider>
  </Provider>
);
