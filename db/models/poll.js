function createPollModel(sequelize, DataTypes) {
  return sequelize.define('polls', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.STRING,
    },
    mode: {
      type: DataTypes.ENUM('s', 'm'),
      defaultValue: 's',
    },
  });
}

module.exports = createPollModel;
