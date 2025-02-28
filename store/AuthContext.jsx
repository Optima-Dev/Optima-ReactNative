import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
  handleRole: (role) => {},
  role: "",
});

function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  function authenticate(token) {
    setToken(token);
    AsyncStorage.setItem("token", token);
  }

  function logout() {
    setToken(null);
    AsyncStorage.removeItem("token");
  }

  function handleRole(role) {
    setRole(role);
  }

  const value = {
    token,
    isAuthenticated: !!token,
    authenticate,
    logout,
    handleRole,
    role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
