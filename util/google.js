var { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
  getToken:(req)=>{
  let token=req.body.credential || req.headers.authorization;
    if (token && token.split(" ")[0] === "Bearer") {
      return token.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    } else if (token) {
      return token
    }

    return null;
  },
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://www.googleapis.com/oauth2/v3/certs`,
  }),

  // Validate the audience and the issuer.
  issuer: `https://accounts.google.com`,
  algorithms: ["RS256"],
});

const Validate = (req, res,next) => {
  if (!req.auth.sub) return res.sendStatus(401);
  else next();

};

module.exports = { checkJwt, Validate};


// app.get(
//   "/protected",
//   jwt({ secret: "shhhhhhared-secret", algorithms: ["HS256"] }),
//   function (req, res) {
//     if (!req.auth.admin) return res.sendStatus(401);
//     res.sendStatus(200);
//   }
// );

