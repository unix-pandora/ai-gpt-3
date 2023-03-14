var pool = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "express",
};

function query() {
  console.dir(pool);
  return pool;
}

exports.query = query;
