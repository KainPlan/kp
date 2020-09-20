<div align="center">
    <img src="images/lgtd.png" width="auto" height="200px" />
    <p>
        <img src="https://img.shields.io/badge/version-2.0-blue?style=for-the-badge" />
        <a href="https://github.com/KainPlan/kp">
            <img src="https://img.shields.io/badge/on-GitHub-blueviolet?style=for-the-badge&logo=github" />
        </a>
    </p>
</div>

---

## About

Version 2.0 of our glorious project! The **hype** is real! Such _w0w_, such _4m4z1ng_ ... such _1337_! Much _c00l_!

## Setup

In case you want to clone this repository and get _KainPlan_ up and running on your machine, all you should have to do is follow these instructions:

### Prerequisites

The current requirements are ...

* Node `v12.18.3`
* NPM `6.14.6`

... do also note, however, that the versions mentioned are simply the ones used on the original system and everything might just work fine with newer/older versions.

### Installation

#### Node

Firstly, clone this repository to your local machine ... 

```bash
$ git clone https://github.com/KainPlan/kp
```

... afterwards, change into the directory that has just been created and use `npm` to install all dependencies ... 

```bash
$ cd kp
$ npm i
```

... and you _should_ be grand! (If you're not, feel free to ask for support ^^).

#### Postgres

Since the user authentication update, the node server will now also be looking to connect to the local `Postgres` server - you need to install / set it up.

First of all, if you don't have Postgres installed, install it and any interface/manager you like (`pgadmin`, [`pgcli`](https://www.pgcli.com/), ...).

Then, simply run the following SQL script to set up the database, user and tables (of course you need to replace `[PWD]` with the proper password):

```sql
-- Create & use the database ...
CREATE DATABASE kainplan;
USE kainplan;
-- Create user & grant privileges ...
CREATE USER kainplan WITH PASSWORD '[PWD]';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO kainplan;
GRANT SELECT, UPDATE, USAGE ON ALL SEQUENCES IN SCHEMA public TO kainplan;
-- Create tables ...
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(40) UNIQUE NOT NULL,
    username    VARCHAR(32) UNIQUE NOT NULL,
    password    VARCHAR(60) NOT NULL
);
CREATE TABLE maps (
    id          BIGSERIAL PRIMARY KEY,
    user        BIGINT NOT NULL,
    map         VARCHAR(24) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user)
            REFERENCES users(id);
);
```

#### MongoDB

Ever since adding maps to KainPlan, you'll also be required to have a `MongoDB` server up and running on your local machine.

First of all, if you don't have the [`MongoDB Community Server`](https://www.mongodb.com/try/download/community) installed, install it and any interfaces/db managers you require ([`mongosh`](https://www.mongodb.com/try/download/shell), [`compass`](https://www.mongodb.com/try/download/compass), ...).

Then simply open your command line interface and execute the following commands, or do it manually in your GUI:

```js
// Create & use the databse ...
use kainplan;
// Create collections ...
db.createCollection('maps');
db.maps.createIndex({ name: "text", desc: "text" });
// Create user & grant privileges ...
db.createRole({
    role: "kainplan",
    privileges: [
        { resource: { db: "kainplan", collection: "" }, actions: [ "find", "insert", "update", "remove" ] }
    ],
    roles: []
});
db.createUser({
    user: "kainplan",
    pwd: "[PWD]",
    roles: [ "kainplan" ],
    authenticationRestrictions: [ { clientSource: [ "127.0.0.1" ], serverAddress: [ "127.0.0.1" ] } ]
});

```

... obviously you'll have to replace `[PWD]` with the real password.

## To-Do

The following is a list of things that have to be done - it is only included here so one doesn't forget to do these things.

* [ ] Fix ugly transition between `/login` and `/register`
* [ ] Proper landing page, `/`
* [ ] Fix `/search` "clear input"-problems
* [ ] Proper `/search` query error handling
* [ ] Proper `/dashboard` fetch error handling
* [ ] Dashboard pages
  * [ ] Overview
  * [ ] Settings
  * [ ] Maps
    * [ ] maybe don't refresh page on edit map?
* [ ] API
  * [ ] Check MongoDB user permissions
  * [ ] Limit amount of maps per `/api/maps` request
  * [ ] User session storage in `redis` - current express production warning

---

| Version | Date       | Clearance   |
| ------- | ---------- | ----------- |
| 0.12    | 2020.09.20 | _Team only_ |
