//test login page
const { Datastore } = require("@google-cloud/datastore");
const kind = "users";
const users = require("../models/user.js");
const general = require("../util/dataStore.js");
const datastore = new Datastore();

const LoginPage = async (req, res, next) => {
  res.render("loginPage");
};

const addUser = async (req, res, next) => {
  const key = datastore.key([kind, req.auth.sub]);
  let user = new users.users(
    req.auth.given_name,
    req.auth.family_name,
    req.auth.email
  );
  general.insert(key, user);
  next()
};

const sendKey = async (req, res, next) => {
  body = { token: req.body.credential, id: req.auth.sub };
  res.status(200).send(body);
}
const getUsers = async (req, res) => {
  let resp = await general.getEntities(kind);
  console.log(resp)
  res.send(resp);
};
module.exports = {
  LoginPage,
  addUser,
  getUsers,
  sendKey
};
