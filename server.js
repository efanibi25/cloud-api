const express = require('express');
const app = express();
const exphbs = require("express-handlebars");


//routes
const boats = require("./routes/boats.js");
const loads = require("./routes/loads.js");
const auth = require("./routes/auth.js");
const errors = require("./errors/errors.js");



app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
// Setting template Engine
app.set('view engine', 'hbs');
// //middleware



// //middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(express.json()) 
app.use("/loads", loads);
app.use("/boats", boats);
app.use("/", auth);


app.use("/", errors.missingParams);
app.use("/", errors.notFound);
app.use("/", errors.assigned);
app.use("/", errors.missingLoad);
app.use("/", errors.denied);
app.use("/", errors.notFound2);
app.use("/", errors.invalidParams);
app.use("/", errors.tooManyParams);
app.use("/", errors.restrictedParams);
app.use("/", errors.expiredToken);
app.use("/",errors.deniedItem)
app.use("/", errors.loadNotTied);
app.use("/", errors.invalidAcceptHeader);

// Configure template Engine and Main Template File

// global.siteURl = "https://rising-pen-346423.uc.r.appspot.com";

global.siteURl = "http://localhost:8080";


;





// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.export={app}