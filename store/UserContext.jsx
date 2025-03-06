import { createContext, useState, useContext } from "react";

export const UserContext = createContext({
  user: [],
  setUser: () => {},
});

function UserProvider({ children }) {
  const [user, setUser] = useState([]);

  const value = {
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={value}>
      { children }
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export default UserProvider;
