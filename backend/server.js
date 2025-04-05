const app = require('./app');
const db = require('./config/db');
const PORT = process.env.PORT || 5000;

// DB bağlantısını test et
db.getConnection()
  .then((connection) => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
