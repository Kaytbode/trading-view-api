const { Pool } = require('pg');
require('dotenv').config();

//const { TRDVIEWPGHOST, TRDVIEWPGPORT, TRDVIEWPGUSER, TRDVIEWPGPW, TRDVIEWPGDB } = process.env;

/*const pool = new Pool({
    host: TRDVIEWPGHOST,
    port: TRDVIEWPGPORT,
    user: TRDVIEWPGUSER,
    password: TRDVIEWPGPW,
    database: TRDVIEWPGDB
});*/

const pool = new Pool({
    connectionString: 'postgres://cqjhgzep:CRRlqpqCuKkMr_0mVOPLC2IslQIwiTUT@raja.db.elephantsql.com/cqjhgzep'
})

module.exports = { pool };