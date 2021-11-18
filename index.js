const config = require('./config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const { videoToken } = require('./tokens');
const { NetworkInstance } = require('twilio/lib/rest/supersim/v1/network');
const { rest } = require('lodash');
const {
  AddOnResultContext,
} = require('twilio/lib/rest/api/v2010/account/recording/addOnResult');

const app = express();
app.use(cors());
cors({ credentials: true, origin: true });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);
// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-Requested-With,content-type,Authorization'
//   );
//   next();
// });

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.options('/video/token', cors());

const sendTokenResponse = (token, res) => {
  res.send(
      token: token.toJwt(),
  );
};

app.get('/api/greeting', cors(), (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get('/video/token', (req, res) => {
  const identity = req.query.identity;
  const room = req.query.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.post('/video/token', (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Express server is running on ${port}`));
