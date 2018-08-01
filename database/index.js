var config = require('../config');
var Sequelize = require('sequelize');
var db = {
	sequelize:new Sequelize(config.sequelize.database,config.sequelize.username,config.sequelize.password,config.sequelize)
};
db.Porn = db.sequelize.import('../model/porn.js');
db.PornHot = db.sequelize.import('../model/porn_hot.js');
db.PornView = db.sequelize.import('../model/porn_view.js');
db.PornRate = db.sequelize.import('../model/porn_rate.js');
db.NineOne = db.sequelize.import('../model/nineone.js');
module.exports = db;