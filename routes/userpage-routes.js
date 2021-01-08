const express = require('express')
var DBConnection = require("../config/DBConnection")
var app = express();
var axios = require('axios');
var loginController = require('../controllers/login-controller');
const userService = require('../services/user-service');

let userPageRender = async function (app, title) {
  // get request
  app.get("/user", async function (req, res) {
    userService.listGames(req.user, function (err, games) {
      // Renders the user.handlebars page and sends it the data obj 
      // that contains the requested image/score/title/description and also grabs the user data
      let user = JSON.parse(JSON.stringify(req.user))
      let gamesList = JSON.parse(JSON.stringify(games))
      console.log(gamesList)
      res.render('user', { user: user, gamesList: gamesList })
    })
});
app.post('/user/addGame', function(req, res) { 
  userService.addGame(req.user, req.body.id, req.body.title, req.body.game_img, function (err, results) {
      if (err) {throw err}
      res.status(201).send('Created');
  });
});

app.post('/user/removeGame', function(req, res) {
  userService.removeGame(req.user, req.body.id, function (err, results) {
      if (err) {throw err}
      res.status(200).send('Success');
  });
})
}

module.exports = {userPageRender : userPageRender}