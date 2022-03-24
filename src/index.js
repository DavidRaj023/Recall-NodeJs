const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const appRouter = require('./router/appRoutes');
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());


const db = require('./service/dbService');
db.sequelize.sync();
// drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });
appRouter(app);
app.listen(PORT, () => {
    console.log("Server started and running in port: " + PORT);
});