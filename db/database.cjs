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
            knex.select('username', 'wins', 'losses', 'hits', 'points', 'ball', 'pet', 'icon')
              .from('accounts')
              .where('username', request.body.username)
              .then(rows => {
                rows[0]['token'] = token
                rows[0]['item_array'] = []
                console.log('login rows:', JSON.stringify(rows[0]));
                response.status(200).json(JSON.stringify(rows[0]))
              })
              .catch(err => {
                console.error(err);
              })

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
              let item_array
              return jwt.sign(user.username, SECRET, (error, token) => {
                knex.select('item_id')
                  .from('items')
                  .where('username', user.username)
                  .then(item_row => {
                    item_array = item_row.map(row => row.item_id);
                    console.log('itemarray:', item_array);
                  })

                knex.select('username', 'wins', 'losses', 'hits', 'points', 'ball', 'pet', 'icon')
                  .from('accounts')
                  .where('username', request.body.username)
                  .then(rows => {
                    rows[0]['token'] = token
                    rows[0]['item_array'] = item_array
                    console.log('login rows:', JSON.stringify(rows[0]));
                    response.status(200).json(JSON.stringify(rows[0]))
                  })
                  .catch(err => {
                    console.error(err);
                  })

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
  await knex('accounts')
    .where('username', user)
    .increment('points', pointChange)
    .catch(err => {
      console.error(err);
    })
}

async function updateWin(user, winChange) {
  await knex('accounts')
    .where('username', user)
    .increment('wins', winChange)
    .catch(err => {
      console.error(err);
    })
}

async function updateLoss(user, lossChange) {
  await knex('accounts')
    .where('username', user)
    .increment('losses', lossChange)
    .catch(err => {
      console.error(err);
    })
}

async function updateHits(user, hitChange) {
  await knex('accounts')
    .where('username', user)
    .increment('hits', hitChange)
    .catch(err => {
      console.error(err);
    })
}

async function purchaseItem(user, itemID, itemCost) {
  let curPoints
  await knex('accounts')
    .select('points')
    .where('username', user)
    .then(data => {
      curPoints = data[0].points;
      console.log('curppoints:', curPoints)
    })

  await knex('items')
    .select()
    .where('item_id', itemID)
    .then(rows => {
      console.log('item alr purchased?', rows)
      if (rows.length !== 0 || curPoints - itemCost < 0) {
        console.log('cannot purchase')
        return false; // item alr owned or can't afford, return false
      }
    })
   .catch(err => console.error(err))
  
  await knex('accounts')
    .where('username', user)
    .decrement('points', itemCost)
  .catch(err => console.error(err))

  await knex('items').insert({
    username: user,
    item_id: itemID,
  })
  .then(() => {
    console.log(itemID, 'purchased?')
    return true; // Value is in the column
  })
  .catch(err => console.error(err))

      
}

async function getAllPurchasedItems(username) {
  knex.select('item_id')
    .from('items')
    .where('username', user.username)
    .then(item_row => {
      item_array = item_row.map(row => row.item_id);
      console.log('itemarray:', JSON.stringify(item_array));
      response.status(200).json(JSON.stringify(rows))
    })
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
  updateHits,
  purchaseItem,
  getAllPurchasedItems
};

(async () => {

  // Only while developing, we will drop database and re-create it
  await knex.schema.dropTableIfExists('accounts')
  await knex.schema.dropTableIfExists('items')

  await knex.schema.hasTable('accounts').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('accounts', function(table) {
        table.string('username').unique().primary();
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
        table.string('password');
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
    points: 5,
    hits: 2
  });

  await knex('accounts').insert({
    username: 'admin2',
    password: testpw,
    points: 5,
    hits: 1,
    losses: 2
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

})();