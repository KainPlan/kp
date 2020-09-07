import { Pool } from 'pg';
import mongoose from 'mongoose';
import utils from '../utils';

const pool: Pool = new Pool();

mongoose.connect(`mongodb://${process.env.MGHOST}:${process.env.MGPORT}/${process.env.MGDATABASE}`, { 
  authSource: process.env.MGAUTHDB, 
  user: process.env.MGUSER,
  pass: process.env.MGPASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const con = mongoose.connection;

con.on('error', e => utils.log(e));
con.once('open', () => console.log(`[APP:MONGODB]: Successfully connected to mongodb://${process.env.MGHOST}:${process.env.MGPORT}/${process.env.MGDATABASE} ... `));

export default pool;