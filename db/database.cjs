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

async function signup(request, response, next) {
  // check if username is taken
  knex("accounts")
    .where({ username: request.body.username })
    .first()
    .then(user => {
      if (user) {
        return response.status(401).json({
          error: "Username already taken"
        })
      }
    })
  
  await bcrypt.hash(request.body.password, 10)
    .then(hashedPassword => {
      knex("accounts").insert({
        username: request.body.username,
        password: hashedPassword
      })
      .returning(["username", "password"])
      .then(new_user => {
        console.log('signup user', new_user)
        return jwt.sign(new_user[0].username, SECRET, (error, token) => {
          response.status(200).json({ token: token })
          console.log("signup db token:", token)
        })
      })
      .catch(error => next(error))
    })
}

async function login(request, response, next) {
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
              console.log('login user', user)
              return jwt.sign(user.username, SECRET, (error, token) => {
                response.status(200).json({ token: token })
                console.log("db token:", token)
              })
            }
          })
      }
    })
}

function getLeaderboardList(request, response) {
  console.log('leaderboard:')
  knex.select('username', 'wins', 'losses', 'hits')
  .from('accounts')
  .orderBy('wins')
  .orderBy('hits')
  .then(rows => {
      console.log(JSON.stringify(rows));
      response.status(200).json(JSON.stringify(rows))
  })
  .catch(err => {
      console.error(err);
  })

}

async function updatePoints(user, pointChange) {
  knex('accounts')
  .where('username', user)
  .increment('points', pointChange)
  .catch(err => {
    console.error(err);
  })
}

async function updateWin(user, winChange) {
  knex('accounts')
  .where('username', user)
  .increment('wins', winChange)
  .catch(err => {
    console.error(err);
  })
}

async function updateLoss(user, lossChange) {
  knex('accounts')
  .where('username', user)
  .increment('losses', lossChange)
  .catch(err => {
    console.error(err);
  })
}

async function updateHits(user, hitChange) {
  knex('accounts')
  .where('username', user)
  .increment('hits', hitChange)
  .catch(err => {
    console.error(err);
  })
}
 
module.exports = {
  signup,
  login,
  getLeaderboardList,
  updatePoints,
  updateWin,
  updateLoss,
  updateHits
};

(async () => {

  // Only while developing, we will drop database and re-create it
  await knex.schema.dropTableIfExists('accounts')
  await knex.schema.dropTableIfExists('items')

  await knex.schema.hasTable('accounts').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('accounts', function(table) {
        table.string('username').unique().primary();
        table.string('password');
        table.integer('points').defaultTo(0);
        table.check('?? >= ??', ['points', 0]);
        table.integer('wins').defaultTo(0);
        table.integer('losses').defaultTo(0);
        table.integer('hits').defaultTo(0);
        //ball
        table.integer('ball');
        //pet - charm that gets added to player as a customization
        table.integer('pet');
        table.integer('icon');
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

  await knex('accounts').insert({
    username: 'admin2',
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