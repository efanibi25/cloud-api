
function errors(res,next,type){
  
  if (type == "missingParamsBoats") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "missingParams";
      res.locals.item = "boats";
      next(err);
    }
  } else if (type == "missingParamsLoads") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "missingParams";
      res.locals.item = "loads";
      next(err);
    }
  } else if (type == "invalidParams") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "invalidParams";
      next(err);
    }
  } else if (type == "restrictedParamsBoats") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "restrictedParams";
      res.locals.item = "boat";
      next(err);
    }
  } else if (type == "restrictedParamsLoads") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "restrictedParams";
      res.locals.item = "load";
      next(err);
    }
  } else if (type == "accessDeniedBoat") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "accessDenied";
      res.locals.item = "boat";
      next(err);
    }
  } else if (type == "accessDeniedItem") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "accessDeniedItem";
      next(err);
    }
  } else if (type == "accessDeniedLoad") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "accessDenied";
      res.locals.item = "load";
      next(err);
    }
  } else if (type == "notFoundBoat") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "notFound";
      res.locals.item = "boats";
      next(err);
    }
  } else if (type == "notFoundLoad") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "notFound";
      res.locals.item = "loads";
      next(err);
    }
  } else if (type == "notFound2") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "notFound2";
      next(err);
    }
  } else if (type == "expiredToken") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "expiredToken";
      next(err);
    }
  } else if (type == "tooManyParams") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "tooManyParams";
      next(err);
    }
  } else if (type == "assigned") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "assigned";
      next(err);
    }
  } else if (type == "loadNotTied") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "loadNotTied";
      next(err);
    }
  } else if (type == "invalidAcceptHeader") {
    try {
      throw new Error("");
    } catch (err) {
      res.locals.error = "loadNotTied";
      next(err);
    }
  }



    


}
  module.exports = { errors };
