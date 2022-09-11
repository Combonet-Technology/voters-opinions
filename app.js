const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { engine } = require("express-handlebars");
const { default: mongoose } = require("mongoose");
const methodOverride = require("method-override");

// load config
dotenv.config({ path: "./config/.env" });
connectDB();
const app = express();

// body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override middleware
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// load passport
require("./config/passport")(passport);

//handlebars
// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// app.engine('.hbs', expressHBS.engine({defaultLayout:'main', extname: '.hbs'}));
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
  })
);
app.set("view engine", ".hbs");
app.set("views", "./views");

// static settings
app.use(express.static(path.join(__dirname, "public")));

// session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// load passport
require("./config/passport")(passport);

// base routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/opinions", require("./routes/opinions"));

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
