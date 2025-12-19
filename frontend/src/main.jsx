import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";

import { createContext } from "react";
import { ProfileModalProvider } from "./components/ProfileModalContext";

export const ProfileModalContext = createContext(null);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ProfileModalProvider>
        <App />
      </ProfileModalProvider>
    </Provider>
  </StrictMode>
);
