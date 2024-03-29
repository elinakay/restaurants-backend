const { PORT = 5007 } = process.env;

const app = require("./app");
const knex = require("./db/connection");
const cors = require("cors");

app.use(cors());

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
    app.listen(PORT, listener);
  })
  .catch((error) => {
    console.error(error);
    knex.destroy();
  });

function listener() {
  console.log(`Listening on Port ${PORT}!`);
}