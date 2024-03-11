const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SECRET = "any_secret_you_want_to_use"

const knex = require("knex")({
  // We are using PostgreSQL
  client: "postgres",
  // Use the `DATABASE_URL` environment variable we provide to connect to the Database
  // It is included in your Replit environment automatically (no need to set it up)
  connection: process.env.DATABASE_URL,

  // Optionally, you can use connection pools to increase query performance
  pool: { min: 0, max: 80 },

});

async function testSignup(request, response, next) {
  await bcrypt.hash(request.body.password, 10)
    .then(hashedPassword => {
      return knex("accounts").insert({
        username: request.body.username,
        password: hashedPassword
      })
        .returning(["username", "password"])
        .then(users => {
          response.status(200).json(users[0])
          console.log("signup worked:", users[0])
        })
        .catch(error => next(error))
    })
}
// function printUsers(request, response, next) {
//    knex("accounts")
//    .then(users => {
//      response.status(200).send(JSON.stringify(users[0]))
//    })
// }

function login(request, response, next) {
  console.log(request.body)
  knex("accounts")
    .where({ username: request.body.username })
    .first()
    .then(user => {
      if (!user) {
        response.status(401).json({
          error: "No user by that name"
        })
      }
      else {
        return bcrypt
          .compare(request.body.password, user.password)
          .then(isAuthenticated => {
            if (!isAuthenticated) {
              response.status(401).json({
                error: "Unauthorized Access!"
              })
            }
            else {
              return jwt.sign(user, SECRET, (error, token) => {
                response.status(200).json({ token: token })
                console.log("db token:", token)
              })
            }
          })
      }
    })
}

module.exports = {
  testSignup,
  login
};

(async () => {

  // Only while developing, we will drop  database and re-create it
  await knex.schema.dropTableIfExists('accounts')
  await knex.schema.dropTableIfExists('items')

  await knex.schema.hasTable('accounts').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('accounts', function(table) {
        table.string('username').unique().primary();
        table.string('password');
        table.integer('points');
        table.check('?? >= ??', ['points', 0]);
        table.integer('wins');
        table.integer('losses');
        table.integer('hits');
        //ball
        table.integer('ball');
        //pet - charm that gets added to player as a customization
        table.integer('pet');

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

  const testpw = await bcrypt.hash('1234', 10)
  
  await knex('accounts').insert({
    username: 'admin',
    password: testpw,
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

  console.log("test2");
  console.log(test2);

  // await knex("accounts").where("username", "admin").delete();

})();