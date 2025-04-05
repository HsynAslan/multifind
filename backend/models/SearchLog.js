module.exports = (sequelize, DataTypes) => {
    const SearchLog = sequelize.define('SearchLog', {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      query: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      result_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.TIMESTAMP,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      tableName: 'search_logs',
      timestamps: false, // Eğer timestamp'ları Sequelize otomatik olarak eklemesini istemiyorsanız.
    });
  
    SearchLog.associate = (models) => {
      SearchLog.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return SearchLog;
  };
  