import React, { createContext, useState, useEffect, useContext } from 'react';
import fetch from 'isomorphic-unfetch';
import User from "../../../models/User";

interface UserContextProps {
  authenticated: boolean;
  loading: boolean;
  user?: User;
};

const UserContext = createContext<UserContextProps>({ authenticated: false, loading: true, });

export const UserProvider = ({ passport, children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseURL = 'http://localhost:3000/api/users';

  useEffect(() => {
    (async () => {
      if (!passport) return setLoading(false);
      const res = await fetch(`${baseURL}/info`);
      if (!res.ok) return setLoading(false);
      const json = await res.json();
      if (!json.success) return setLoading(false);
      setUser(User.load(json.user));
      setLoading(false);
    })();
  }, []);

  return (
    <UserContext.Provider value={{ authenticated: Boolean(user), user, loading, }}>
      {children}
    </UserContext.Provider>
  );
};

export default function useUser() {
  const context = useContext(UserContext);
  return context;
}