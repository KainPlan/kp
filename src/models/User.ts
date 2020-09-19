import db from '../db';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

export class UserNotFoundError extends Error {
};

interface UserRow {
  id: number;
  email: string;
  username: string;
  password: string;
};

export default class User {
  public id: number;
  public email: string;
  public username: string;
  public password: string;

  constructor(id: number, email: string, username: string, password: string) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
  }

  public checkPassword(password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password, (err: Error, same: boolean) => {
        if (err) return reject(err);
        resolve(same);
      })
    });
  }

  public sanitize(): object {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
    };
  }

  public static make(email: string, username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 12, (err: Error, hash: string) => {
        if (err) return reject(err);
        db.query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3)', [email, username, hash,])
          .then(res => {
            fs.mkdir(path.join(process.env.RES_PATH, username), err => {
              if (err) reject(err);
              resolve();
            });
          })
          .catch(reject);
      });
    });
  }
  
  public static verify(username: string, password: string, done: (error?: Error|null, user?: any) => void): void {
    User.load(username).then(user => {
      user.checkPassword(password)
          .then(same => {
            if (!same) return done(null, false);
            done(null, user);
          })
          .catch(err => done(null, false));
    }).catch(err => done(null, false));
  }

  public static load(id: number): Promise<User>;
  public static load(username: string): Promise<User>;

  public static load(ident: number|string): Promise<User> {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE ${typeof ident === 'string' ? 'username' : 'id'} = $1`, [ident,])
        .then(res => {
          if (res.rowCount == 0) return reject(new UserNotFoundError());
          const row: UserRow = res.rows[0];
          resolve(new User(row.id, row.email, row.username, row.password));
        })
        .catch(reject);
    });
  }

  public static isEmailTaken(email: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = $1', [email,])
        .then(res => {
          resolve(res.rowCount !== 0);
        })
        .catch(reject);
    });
  }

  public static isUsernameTaken(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE username = $1', [username,])
        .then(res => {
          resolve(res.rowCount !== 0);
        })
        .catch(reject);
    });
  }
};