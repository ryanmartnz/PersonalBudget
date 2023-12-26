const Pool = require('pg').Pool
const pool = new Pool({
  user: 'ryan',
  host: 'localhost',
  database: 'personalbudget',
  password: 'jackalope',
  port: 5432,
});

const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};

module.exports = {
  query
};

// const envelopes = [
//     {
//       id: 1,
//       title: "Rent",
//       budget: 1000
//     },
//     {
//       id: 2,
//       title: "Groceries",
//       budget: 300
//     },
//     {
//       id: 3,
//       title: "Entertainment",
//       budget: 400
//     },
// ];
  
// module.exports = envelopes;
  