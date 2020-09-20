import React, { createContext, useState, useEffect, useContext } from 'react';
import fetch from 'isomorphic-unfetch';
import User from "../../../models/User";

interface UserContextProps {
  authenticated: boolean;
  loading: boolean;
  user?: User;
  refresh: ()=>Promise<void>;
};

const UserContext = createContext<UserContextProps>({ authenticated: false, loading: true, refresh: ()=>new Promise(resolve => resolve()), });

export const UserProvider = ({ passport, children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseURL = '/api/users';

  useEffect(() => {
    if (!passport) return setLoading(false);
    refresh();
  }, []);

  const refresh = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      fetch(`${baseURL}/info`)
        .then(res => {
          if (!res.ok) resolve(setLoading(false));
          return res.json();
        })
        .then(res => {
          if (!res.success) resolve(setLoading(false));
          setUser(User.load(res.body.user));
          resolve(setLoading(false));
        })
        .catch(reject);
    });
  };

  return (
    <UserContext.Provider value={{ authenticated: Boolean(user), user, loading, refresh, }}>
      {children}
    </UserContext.Provider>
  );
};

export default function useUser() {
  const context = useContext(UserContext);
  return context;
}