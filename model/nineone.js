module.exports = function (sequelize, DataTypes) {
  var NineOne = sequelize.define('tb_nineone', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING
    },
    quality_240: {
      type: DataTypes.STRING
    },
    quality_480: {
      type: DataTypes.STRING
    },
    quality_720: {
      type: DataTypes.STRING
    },
    duration: {
      type: DataTypes.STRING
    },
    collect: {
      type: DataTypes.INTEGER
    }
  }, {
    freezeTableName: true//数据库中的表名与程序中的保持一致，否则数据库中的表名会以复数的形式命名
  });
  return NineOne;
};