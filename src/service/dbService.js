const dbConfig = require('../config/db.config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

sequelize.authenticate().then(() => {
    console.log("Connected to database....");
}).catch((err) => {
    console.log("Unable to connect to database");
})


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Admin = require('../models/admin')(sequelize, Sequelize);
db.Owner = require('../models/owner')(sequelize, Sequelize);
//db.Hotel = require('../models/hotels')(sequelize, Sequelize);
db.Room = require('../models/rooms')(sequelize, Sequelize);
db.User = require('../models/user')(sequelize, Sequelize);
module.exports = db;