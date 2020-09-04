import React from 'react';
import User from "../../../models/User";

export interface UserContextProps {
  authenticated: boolean;
  user?: User;
};

const UserContext: React.Context<UserContextProps> = React.createContext<UserContextProps>({
  authenticated: false,
});

export default UserContext;

interface UserProviderProps {
  children: React.ReactElement|React.ReactElement[];
};

interface UserProviderState extends UserContextProps {
};

export class UserProvider extends React.Component<UserProviderProps, UserProviderState> {
  private static baseURL: string = 'http://localhost/api/users';

  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
    };
  }

  
}