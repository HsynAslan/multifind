const { sequelize } = require('./models');  // 'models' dizinindeki sequelize'i import edin

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
