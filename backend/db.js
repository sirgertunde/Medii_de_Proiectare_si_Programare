const {Pool} = require("pg");

const pool = new Pool({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"",
    database:"mppDB"
});

module.exports = pool;