import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import BackendProvider from "./context/backendContext.jsx";

let persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BackendProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </BackendProvider>
  </StrictMode>
);
