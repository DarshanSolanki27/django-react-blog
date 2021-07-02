import React, { useContext, useState } from "react";

const AuthContext = React.createContext();
const UpdateAuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function useUpdateAuth() {
  return useContext(UpdateAuthContext);
}

export default function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("torch_at") !== null
  );

  return (
    <AuthContext.Provider value={isAuth}>
      <UpdateAuthContext.Provider value={setIsAuth}>
        {children}
      </UpdateAuthContext.Provider>
    </AuthContext.Provider>
  );
}
