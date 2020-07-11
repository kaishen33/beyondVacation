// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
///////////////// ABOVE = user auth/login/signup ------ BELOW = routes for post, viewing, and updating listings

  // Route to post new listing:
  app.post("/api/listings", (req,res) => {
    db.Listings.create(req.body).then((list) => {
      res.json(list);
    })
  })

  // Route to get all new listings:
  app.get("/api/listings", (req,res) => {
    db.Listings.findAll({}).then((list) => {
      res.json(list);
    })
  })

  // Route to get filtered listings based on category:
  app.get("/api/listings/:category", (req,res) => {
    db.Listings.findAll({where: {category: req.params.category}}).then((list) => {
      res.json(list);
    })
  })

  // Route to get filtered listings based on price:
  app.get("/api/listings/:price", (req,res) => {
    db.Listings.findAll({where: {price: {$lte: req.params.price}}}).then((list) => {
      res.json(list);
    })
  })

  // Route to get one listing based on id:
  app.get("/api/listings/:id", (req,res) => {
    db.Listings.findOne({where: {id: req.params.id}}).then((list) => {
      res.json(list);
    })
  })

  // Route to update for when a listing is reserved:
  app.put("/api/listings", (req,res) => {
    db.Listings.update(req.body, {where: {id: req.body.id}}).then((list) => {
      res.json(list);
    })
  })

  // Route to delete a listing:
  app.delete("/api/listings/:id", (req,res) => {
    db.Listings.destroy({where: {id: req.params.id}}).then((list) => {
      res.json(list);
    })
  })
};
