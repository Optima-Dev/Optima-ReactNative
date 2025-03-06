import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
  handleRole: (role) => {},
  role: "",
  isNewUser: false,
});

function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  function authenticate(token, isNewUser) {
    setToken(token);
    AsyncStorage.setItem("token", token);
    // setIsNewUser(isNewUser);
    // AsyncStorage.setItem("isNewUser", JSON.stringify(isNewUser));
  }

  function logout() {
    setToken(null);
    setIsNewUser(false);
    AsyncStorage.removeItem("token");
    // AsyncStorage.removeItem("role");
    // AsyncStorage.removeItem("isNewUser");
    // AsyncStorage.removeItem("@user");
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
