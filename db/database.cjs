const knex = require("knex")({
  // We are using PostgreSQL
  client: "postgres",
  // Use the `DATABASE_URL` environment variable we provide to connect to the Database
  // It is included in your Replit environment automatically (no need to set it up)
  connection: process.env.DATABASE_URL,

  // Optionally, you can use connection pools to increase query performance
  pool: { min: 0, max: 80 },

});

(async () => {

  knex.schema.hasTable('accounts').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable("accounts", function(table) {
        table.increments("id");
        table.string("username");
        table.string("password");
      });
    }
  });
  
  await knex("accounts").insert({
    username: "admin",
    password: "1234",
  });
  
  const user = await knex('accounts')
  .where('username', 'admin')
  // .first();
  
  console.log(user);

  await knex("accounts").where("username", "admin").delete();

})();