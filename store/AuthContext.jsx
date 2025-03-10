import { createContext, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
  handleRole: (role) => {},
  role: "",
  isNewUser: false,
  setNewUser: () => {},
});

function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [isNewUser, setNewUser] = useState(false);

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
    AsyncStorage.setItem("role", role);
  }

  const value = {
    token,
    isAuthenticated: !!token,
    authenticate,
    logout,
    handleRole,
    role,
    isNewUser,
    setNewUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
