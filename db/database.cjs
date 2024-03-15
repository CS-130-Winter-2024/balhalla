const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const assert = require('assert')
const SECRET = "any_secret_you_want_to_use"

var URL = process.env.DATABASE_URL;
var doTest = false
if (URL == null) {
  try {
    let DB_URL = require("./keys.cjs");
    URL = DB_URL
  } catch {
    //if we cant connect, dont even try lol
    module.exports = {
      signup: () => { },
      login: () => { },
      getLeaderboardList: () => { },
      updatePoints: () => { },
      updateWin: () => { },
      updateLoss: () => { },
      updateHits: () => { },
      purchaseItem: () => { },
      getAllPurchasedItems: () => { }
    }
    return;
  }
}

var tokens = {}


const knex = require("knex")({
  // We are using PostgreSQL
  client: "postgres",
  // Use the `DATABASE_URL` environment variable we provide to connect to the Database
  // It is included in your Replit environment automatically (no need to set it up)
  connection: URL,

  // Optionally, you can use connection pools to increase query performance
  pool: { min: 0, max: 80 },

});

/**
 * Creates a new user in the database if they do not already exist.
 *
 * @async
 * @param {Request} request - POST request object containing {string} username and {string} password
 * @param {Response} response - Fetch response object to be returned
 * @returns
 * {
 *   {string} username,
 *   {integer} wins,
 *   {integer} losses,
 *   {integer} hits,
 *   {integer} points,
 *   {integer} ball,
 *   {integer} pet,
 *   {integer} icon,
 *   {string} token,
 *   {[integer]} item_array,
 * }
 */
async function signup(request, response) {
  // check if username is taken
  if (request.body.username.slice(0, 5) == "Guest") {
    return response.status(401).json({
      error: "Username already taken"
    })
  }
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
          knex('items').insert({
            username: request.body.username,
            item_id: 2,
          }).catch(err => {
            console.log(err)
          });
          console.log('signup user', new_user)
          return jwt.sign(new_user[0].username, SECRET, (error, token) => {
            knex.select('username', 'wins', 'losses', 'hits', 'points', 'ball', 'pet', 'icon')
              .from('accounts')
              .where('username', request.body.username)
              .then(rows => {
                rows[0]['token'] = token
                tokens[token] = request.body.username;
                rows[0]['item_array'] = [2]
                console.log('login rows:', JSON.stringify(rows[0]));
                response.status(200).json(rows[0])
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

/**
 * Logs an existing user in the database with the correct password into their account.
 *
 * @async
 * @param {Request} request - POST request object containing {string} username and {string} password
 * @param {Response} response - Fetch response object to be returned
 * @returns
 * {
 *   {string} username,
 *   {integer} wins,
 *   {integer} losses,
 *   {integer} hits,
 *   {integer} points,
 *   {integer} ball,
 *   {integer} pet,
 *   {integer} icon,
 *   {string} token,
 *   {[integer]} item_array,
 * }
 */
async function login(request, response) {
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
                  }).then(() => {

                    knex.select('username', 'wins', 'losses', 'hits', 'points', 'ball', 'pet', 'icon')
                      .from('accounts')
                      .where('username', request.body.username)
                      .then(rows => {
                        tokens[token] = request.body.username;
                        rows[0]['token'] = token
                        rows[0]['item_array'] = item_array
                        console.log('login rows:', JSON.stringify(rows[0]));
                        response.status(200).json(rows[0])
                      })
                  })
                  .catch(err => {
                    console.error(err);
                  })

                knex.update({ token: token })
                  .where('username', request.body.username);

                console.log("db token:", token)
              })
            }
          })
      }
    })
}

/**
 * At page load, checks locally stored token against database to log user in.
 *
 * @async
 * @param {Request} request - POST request object containing {string} token
 * @param {Response} response - Fetch response object to be returned
 * @returns
 * {
 *   {string} username,
 *   {integer} wins,
 *   {integer} losses,
 *   {integer} hits,
 *   {integer} points,
 *   {integer} ball,
 *   {integer} pet,
 *   {integer} icon,
 *   {[integer]} item_array,
 * }
 */
async function tokenLogin(request, response) {
  console.log(request.body)
  if (!(request.body.token in tokens)) {
    response.status(401).json({
      error: "Token invalid"
    })
    return;
  }

  let item_array
  knex.select('item_id')
    .from('items')
    .where('username', tokens[request.body.token])
    .then(item_row => {
      item_array = item_row.map(row => row.item_id);
      console.log('itemarray:', item_array);
    }).then(() => {
      knex.select('username', 'wins', 'losses', 'hits', 'points', 'ball', 'pet', 'icon')
        .from('accounts')
        .where('username', tokens[request.body.token])
        .then(rows => {
          rows[0]['item_array'] = item_array
          console.log('login rows:', JSON.stringify(rows[0]));
          response.status(200).json(rows[0])
        })
        .catch(err => {
          console.error(err);
        })
    }).catch(err => {
      console.error(err);
    })
}

/**
 * Returns the current leaderboard list sorted by descending wins then descending hits.
 * @param {Request} request - GET request object
 * @param {Response} response - Fetch response object to be returned
 * @returns
 * {
 *   [
 *     {string} username,
 *     {integer} wins,
 *     {integer} losses,
 *     {integer} hits,
 *   ]
 * }
 */
function getLeaderboardList(request, response) {
  console.log('leaderboard:')
  knex.select('username', 'wins', 'losses', 'hits')
    .from('accounts')
    .orderBy('wins', 'desc')
    .orderBy('hits', 'desc')
    .then(rows => {
      console.log(JSON.stringify(rows));
      response.status(200).json(JSON.stringify(rows))
    })
    .catch(err => {
      console.error(err);
    })

}

/**
 * Returns the current leaderboard list sorted by descending wins then descending hits.
 *
 * @async
 * @param {string[]} usernames
 * @returns Object.<string, integer> output - an object containing the username as the key and the number of points they have as the value
 */
async function getPointsByUsernames(usernames) {
  let points = await knex.select("username", "points").from('accounts').whereIn("username", usernames);
  let output = {}
  for (const entry of points) {
    output[entry.username] = entry.points
  }
  return output;
}

/**
 * Updates the points for a given user in the 'accounts' table.
 *
 * @async
 * @param {string} user - The username of the user whose points should be updated.
 * @param {number} pointChange - The amount of points to be added or subtracted from the user's current points.
 */
async function updatePoints(user, pointChange) {
  await knex('accounts')
    .where('username', user)
    .increment('points', pointChange)
    .catch(err => {
      console.error(err);
    })
}

/**
 * Updates the win count for a given user in the 'accounts' table.
 *
 * @async
 * @param {string} user - The username of the user whose win count should be updated.
 * @param {number} winChange - The amount to be added or subtracted from the user's current win count.
 */
async function updateWin(user, winChange) {
  await knex('accounts')
    .where('username', user)
    .increment('wins', winChange)
    .catch(err => {
      console.error(err);
    })
}

/**
 * Updates the loss count for a given user in the 'accounts' table.
 *
 * @async
 * @param {string} user - The username of the user whose loss count should be updated.
 * @param {number} lossChange - The amount to be added or subtracted from the user's current loss count.
 */
async function updateLoss(user, lossChange) {
  await knex('accounts')
    .where('username', user)
    .increment('losses', lossChange)
    .catch(err => {
      console.error(err);
    })
}

/**
 * Updates the hit count for a given user in the 'accounts' table.
 *
 * @async
 * @param {string} user - The username of the user whose hit count should be updated.
 * @param {number} hitChange - The amount to be added or subtracted from the user's current hit count.
 */
async function updateHits(user, hitChange) {
  await knex('accounts')
    .where('username', user)
    .increment('hits', hitChange)
    .catch(err => {
      console.error(err);
    })
}

/**
 * Updates the ball, pet, and icon items for a user in the 'accounts' table.
 *
 * @async
 * @param {string} token - The token associated with the user whose items should be updated.
 * @param {string} ball - The new ball item for the user.
 * @param {string} pet - The new pet item for the user.
 * @param {string} icon - The new icon item for the user.
 */
async function updateItems(token, ball, pet, icon) {
  await knex('accounts')
    .where('username', tokens[token])
    .update({
      ball: ball,
      pet: pet,
      icon: icon,
    })
}

/**
 * Allows a user to purchase an item by deducting the item cost from their points and adding the item to their account. Checks if the user has enough points to purchase the item and does not already own the item. Additionally, item purchases are logged in the 'items' table.
 *
 * @async
 * @param {string} token - The token associated with the user making the purchase.
 * @param {number} itemID - The ID of the item to be purchased.
 * @param {number} itemCost - The cost of the item in points.
 * @param {Object} response - The Fetch response object to returned.
 * @returns
 * {
 *   {boolean} success,
 *   {[integer]} itemArray,
 * }
 */
async function purchaseItem(token, itemID, itemCost, response) {
  let curPoints
  let user = tokens[token];
  if (!user) { //
    response.json({ success: false, itemArray: null });
    return false
  }
  await knex('accounts')
    .select('points')
    .where('username', user)
    .then(data => {
      curPoints = data[0].points;
      console.log('curppoints:', curPoints)
    })
  if (curPoints < itemCost) {
    response.json({ success: false, itemArray: null })
    return false;
  }
  let items;
  let canPurchase = await knex('items')
    .select()
    .where({ "username": user })
    .then(rows => {
      console.log('item alr purchased?', rows)
      items = rows;
      for (const row of rows) {
        if (row.item_id == itemID) {
          console.log('cannot purchase')
          response.status(200).json({ success: false, itemArray: null })
          return false;
        }
      }
      return true;
    })
    .catch(err => console.error(err))
  if (!canPurchase) return;


  await knex('accounts')
    .where('username', user)
    .decrement('points', itemCost)
    .catch(err => console.error(err))

  await knex('items').insert({
    username: user,
    item_id: itemID,
  })
    .then(() => {
      items = items.map(x => x.item_id);
      items.push(Number(itemID));
      console.log(items)
      response.status(200).json({ success: true, itemArray: items });
      return;
    })
    .catch(err => console.error(err))
}

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

/**
 * Retrieves all the purchased items for a given username from the 'items' table and sends them as a JSON response.
 *
 * @async
 * @param {string} username - The username of the user whose purchased items should be retrieved.
 * @param {Respone} response - The Fetch response object to be send {integer[]} item_array.
 */
async function getAllPurchasedItems(username, response) {
  knex.select('item_id')
    .from('items')
    .where('username', username)
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
  tokenLogin,
  getLeaderboardList,
  updatePoints,
  updateWin,
  updateLoss,
  updateHits,
  purchaseItem,
  getAllPurchasedItems,
  updateItems,
  getPointsByUsernames
};
getPointsByUsernames(["bigcheung", "admin"]);

if (!doTest) return;
(async () => {

  // Only while developing, we will drop database and re-create it
  // await knex.schema.dropTableIfExists('accounts')
  // await knex.schema.dropTableIfExists('items')

  /**
   * Creates the account table and sets default values where appropriate.
   * Ensures that points value is always non-negative.
   */
  await knex.schema.hasTable('accounts').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('accounts', function(table) {
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
    }
  });
  /**
   * Creates the items table.
   */
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
    username: 'admin2',
    password: testpw,
    points: 5,
    hits: 1,
    losses: 2
  });

  await knex('items').insert({
    username: 'admin',
    item_id: 2,
  });
  await knex('items').insert({
    username: 'admin',
    item_id: 3,
  });

  const user = await knex('accounts').where('username', 'admin')
  console.log(user);

  const test2 = await knex.select('*')
    .from('accounts')
    .leftOuterJoin('items', 'accounts.username', 'items.username')

  console.log("test2");
  console.log(test2);

})();