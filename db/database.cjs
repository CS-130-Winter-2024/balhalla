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

  // Only while developing, we will drop  database and re-create it
  // await knex.schema.dropTableIfExists('accounts')
  // await knex.schema.dropTableIfExists('items')

  await knex.schema.hasTable('accounts').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('accounts', function(table) {
        table.string('username').unique().primary();
        table.string('password');
        table.integer('points');
        table.check('?? >= ??', ['points', 0]);
      });
    }
  });
  await knex.schema.hasTable('items').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('items', function(table) {
        table.string('username');
        table.integer('item_id');
      });
    }
  });
  
  // TEST CASES - Ishaan

  await knex('accounts').insert({
    username: 'admin',
    password: '1234',
    points: 0,
  });

  await knex('items').insert({
    username: 'admin',
    item_id: 11,
  });
  await knex('items').insert({
    username: 'admin',
    item_id: 12,
  });

  const user = await knex('accounts').where('username', 'admin')
  console.log(user);

  const test2 = await knex.select('*')
    .from('accounts')
    .leftOuterJoin('items', 'accounts.username', 'items.username')

  console.log(test2);

  await knex("accounts").where("username", "admin").delete();

})();