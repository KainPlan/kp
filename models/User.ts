export interface WithUser {
  user?: User;
};

export interface UserJSON {
  id: number;
  email: string;
  username: string;
};

export default class User {
  public id: number;
  public email: string;
  public username: string;

  constructor(id: number, email: string, username: string) {
    this.id = id;
    this.email = email;
    this.username = username;
  }

  public static load(json: UserJSON) {
    return new User(json.id, json.email, json.username);
  }
};