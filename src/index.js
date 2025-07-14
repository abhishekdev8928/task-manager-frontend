import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from "./store/auth"; // ✅ import your AuthProvider
import store from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render (
 <Provider store={store}>
    <BrowserRouter> {/* ✅ Only one BrowserRouter here */}
      <AuthProvider> {/* ✅ AuthProvider can stay */}
        <App />
      </AuthProvider>
      <ToastContainer/>
    </BrowserRouter>
  </Provider>
);

serviceWorker.unregister();