const assert = require('assert')
const bcrypt = require("bcrypt")
const SECRET = "any_secret_you_want_to_use"

var URL = process.env.DATABASE_URL;
const knex = require("knex")({
  // We are using PostgreSQL
  client: "postgres",
  // Use the `DATABASE_URL` environment variable we provide to connect to the Database
  // It is included in your Replit environment automatically (no need to set it up)
  connection: URL,

  // Optionally, you can use connection pools to increase query performance
  pool: { min: 0, max: 80 },

});

describe('test_accounts', () => {

  before(async () => {
    await knex.schema.createTable('test_accounts', function(table) {
        table.string('username').unique().primary();
        table.integer('points').defaultTo(0);
        table.check('?? >= ??', ['points', 0]);
        table.integer('wins').defaultTo(0);
        table.integer('losses').defaultTo(0);
        table.integer('hits').defaultTo(0);
        table.integer('ball').defaultTo(2);
        //pet - charm that gets added to player as a customization
        table.integer('pet');
        table.integer('icon').defaultTo(0);
        table.string('password');
        table.string('token')
    });
  });

  after(async () => {
    await knex.schema.dropTableIfExists('test_accounts');
  });

  it('should insert a new account', async () => {
    const testpw = await bcrypt.hash('password', 10);

    await knex('test_accounts').insert({
      username: 'mocha_test',
      password: testpw,
      points: 5,
      hits: 2
    });

    const acc = await knex('test_accounts').select('*');
    assert.strictEqual(acc.length, 1);
    assert.strictEqual(acc[0].username, 'mocha_test');
    assert.strictEqual(acc[0].points, 5);
    assert.strictEqual(acc[0].hits, 2);
    assert.strictEqual(acc[0].losses, 0);
    assert.strictEqual(acc[0].wins, 0);

  });
});