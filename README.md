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
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(40) UNIQUE NOT NULL,
    username    VARCHAR(32) UNIQUE NOT NULL,
    password    VARCHAR(60) NOT NULL
);
```

## To-Do

The following is a list of things that have to be done - it is only included here so one doesn't forget to do these things.

* [ ] Fix ugly transition between `/login` and `/register`
* [ ] Proper landing page, `/`
* [ ] Fix registration checks - duplicate email, etc.
---

| Version | Date       | Clearance      |
| ------- | ---------- | -------------- |
| 0.4     | 2020.09.04 | _No clearance_ |