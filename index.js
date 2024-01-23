const express = require("express");
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use("/users", (req, res) => {
  res.status(200).send("GET HTTP method on user resource");
});

// Start the server
const PORT = 8099;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
