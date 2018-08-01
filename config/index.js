var config = {
    sequelize:{
        username: 'root',
        password: 'zhaoying',
        database: 'dbmovies',
        host: "localhost",
        dialect: 'mysql',
        port:3306,
        define: {
            underscored: false,// 不使用驼峰式命令规则，这样会在使用下划线分隔
            timestamps: false, // 不要添加时间戳属性 (updatedAt, createdAt)
            paranoid: true// 不从数据库中删除数据，而只是增加一个 deletedAt 标识当前时间.paranoid 属性只在启用 timestamps 时适用
        }
    }
};

module.exports = config;