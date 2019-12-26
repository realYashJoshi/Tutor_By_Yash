const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const passport = require("passport");
const app = express();
const PORT = process.env.PORT || 3001;


// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const db = require("./config/keys").mongoURI;

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(passport.initialize());

require("./config/passport")(passport);
// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
mongoose
  .connect(process.env.MONGODB_URI || db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
