if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}



const express = require("express");
const engineMate = require("ejs-mate");
const app = express();
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');
const AppError = require("./errors/AppError");
const helmet = require("helmet");

const session = require('express-session'); 
const MongoStore = require('connect-mongo');


app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs"); // to render files without extension
app.engine("ejs", engineMate); // use ejs-locals for all ejs templates
app.set("views",__dirname + "/views");

// sanitizes user-supplied data to prevent MongoDB Operator Injection.
app.use(mongoSanitize());


// db url 
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/blogzz";


/* *********
MONGO datu bāze
************* */
const mongoose = require("mongoose");
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind("error occured: "));
db.once("open", () => {
    console.log("Connection to database successful!");
});

const secret = process.env.SECRET || 'supersecrets';

/* SESSION  */
const sessionOptions = {
    name: "blag",
    secret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ secret, mongoUrl: dbUrl, touchAfter: 24 * 3600 }),
    cookie: { 
        httpOnly: true,
        expires: Date.now() + 1000 * 60 *60 *24*7,
        maxAge: 1000 * 60 * 60* 24 *7
     }
  }
app.use(session(sessionOptions), flash());
app.use(helmet());


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

/* *********
 IF PAGE NOT FOUND PAGE 
************* */
app.use((req, res) => {
    throw new AppError(404, "Lapa, ko meklējat neeksistē!");
})

/* *********
ERROR MIDLLEWARE 
************* */
app.use((err, req, res, next)=> {
    if(err.name == "CastError") throw new AppError(500, "Bad request!")
    next(err);
})

app.use((err, req, res, next) => {
    let { message = "Something went wrong!", status = 500 } = err;
    res.render("error", { message, status });
})

const port = process.env.PORT || 3000;
app.listen(port, ()=> {
    console.log(`App is running on port ${port}`)
})