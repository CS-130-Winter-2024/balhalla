const knex = require("knex")({
    // We are using PostgreSQL
    client: "postgres",
    // Use the `DATABASE_URL` environment variable we provide to connect to the Database
    // It is included in your Replit environment automatically (no need to set it up)
    connection: process.env.DATABASE_URL,
  
    // Optionally, you can use connection pools to increase query performance
    pool: { min: 0, max: 80 },
  });