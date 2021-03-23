require('dotenv').config();

const express = require("express");
const engineMate = require("ejs-mate");
const app = express();
const flash = require('connect-flash');

const session = require('express-session'); 
const MongoStore = require('connect-mongo');

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs"); // to render files without extension
app.engine("ejs", engineMate); // use ejs-locals for all ejs templates
app.set("views",__dirname + "/views");

/* flash messages */
// app.use(require('flash')());


/* *********
MONGO datu bāze
************* */
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_ADRESS, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind("error occured: "));
db.once("open", () => {
    console.log("Connection to database successful!");
});

/* SESSION  */
const sessionOptions = {
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_ADRESS })
    // cookie: { secure: true }
  }
app.use(session(sessionOptions), flash())


app.use((req, res, next)=> {
    res.locals.username = req.session.username;
    res.locals.userId = req.session.userId;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

/* *********
ROUTES IMPORTS 
************* */
const blogRoutes = require("./routes/blogs");
const homeRoute = require("./routes/home");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

/* *********
ROUTES USE
************* */
app.use("/", homeRoute);
app.use("/blogs", blogRoutes);
app.use("/auth", authRoute);
app.use("/user", userRoute);


app.get("*", (req, res)=> {
    res.send("UPS, 404")
})

app.listen(process.env.SERVER_PORT, ()=> {
    console.log("App is running on port 3000")
})