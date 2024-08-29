import { createContext, useState } from "react";

export const Context = createContext({
  user: {
    username: "",
    email: "",
  },
  setUser: () => {},
});

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  return (
    <>
    <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
    </>
  );
};

export default ContextProvider;
