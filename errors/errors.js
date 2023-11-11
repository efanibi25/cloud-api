
//errors
const missingParams = function (err, req, res, next) {
  if (res.locals.error == "missingParams") {
    res.status(400).send({
      Error: `The ${res.locals.item} object is missing at least one of the required attributes`,
    });
  }
  next(err);
};


const invalidParams = function (err, req, res, next) {
  if (res.locals.error == "invalidParams") {
    res.status(400).send({
      Error: `One or more Parameters are invalid/missing`,
    });
  }
  next(err);
};


const notFound = function (err, req, res, next) {
  if (res.locals.error == "not found") {
    res.status(404).send({
      Error: `The specified ${res.locals.item} does not exist`,
    });
  }
  next(err);
};


const notFound2 = function (err, req, res, next) {
  if (res.locals.error == "not found boat/load") {
    res.status(404).send({
      Error: `The specified boat and/or load does not exist`,
    });
  }
  next(err);
};
const assigned = function (err, req, res, next) {
  if (res.locals.error == "assigned") {
    res.status(403).send({
      Error: "This load is already assigned to a boat",
    });
  }
  next(err);
};

const denied = function (err, req, res, next) {
  if (res.locals.error == "accessDenied") {
     res.status(403).send({
       Error: `You do not have access to the specified ${res.locals.item}`,
     });
  }
  next(err);
};

const deniedItem = function (err, req, res, next) {
  if (res.locals.error == "accessDenied") {
    res.status(403).send({
      Error: `You do not have access to the specified item`,
    });
  }
  next(err);
};

const loadNotTied = function (err, req, res, next) {
  if (res.locals.error == "loadNotTied") {
    res.status(403).send({
      Error: `Load is not tied to the boat`,
    });
  }
  next(err);
};

const missingLoad = function (err, req, res, next) {
  if (res.locals.error == "missingLoad") {
    res.status(404).send({
      Error: `No boat with this boat_id is loaded with the load with this load_id`,
    });
  }
  next(err);
};


const tooManyParams = function (err, req, res, next) {
  if (res.locals.error == "tooManyParams") {
    res.status(400).send({
      Error: `You can only modifiy one param with patch`,
    });
  }
  next(err);
};

const restrictedParams= function (err, req, res, next) {
  if (res.locals.error == "restrictedParams") {
    res.status(400).send({
      Error: `Patch/Put  on ${res.locals.item} failed because you are trying to modify a restricted parameter`,
    });
  }
  next(err);
};


const expiredToken = function (err, req, res, next) {
  if (res.locals.error == "expiredToken") {
    res.status(401).send({
      Error: `Token Provided has Expired`,
    });
  }
  next(err);
};

const invalidAcceptHeader = function (err, req, res, next) {
  if (res.locals.error == "invalidAcceptHeader") {
    res.status(401).send({
      Error: `Valid Accept Header Not Provided`,
    });
  }
  next(err);
};
module.exports = {
  expiredToken,
  missingParams,
  invalidParams,
  notFound,
  notFound2,
  assigned,
  denied,
  missingLoad,
  tooManyParams,
  restrictedParams,
  deniedItem,
  loadNotTied,
  invalidAcceptHeader,
};
