import React, { createContext, useContext } from "react";

const BackendContext = createContext(null);

export const BackendProvider = ({ children }) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  return (
    <BackendContext.Provider value={backendUrl}>
      {children}
    </BackendContext.Provider>
  );
};

export const useBackendUrl = () => {
  const context = useContext(BackendContext);

  if (!context) {
    throw new Error(
      "useBackendUrl must be used inside a <BackendProvider>. Wrap your app with it."
    );
  }

  return context;
};

export default BackendProvider;
