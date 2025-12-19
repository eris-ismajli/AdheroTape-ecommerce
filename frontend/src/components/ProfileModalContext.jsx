import { createContext, useContext, useState } from "react";

const ProfileModalContext = createContext(null);

export const ProfileModalProvider = ({ children }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <ProfileModalContext.Provider
      value={{ showProfileModal, setShowProfileModal }}
    >
      {children}
    </ProfileModalContext.Provider>
  );
};

export const useProfileModal = () => {
  const ctx = useContext(ProfileModalContext);
  if (!ctx) {
    throw new Error("useProfileModal must be used inside ProfileModalProvider");
  }
  return ctx;
};
