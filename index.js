const express = require("express");
const engineMate = require("ejs-mate");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs"); // to render files without extension
app.engine("ejs", engineMate); // use ejs-locals for all ejs templates
app.set("views",__dirname + "/views");

/* *********
MONGO datu bāze
************* */
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogzz", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind("error occured: "));
db.once("open", () => {
    console.log("Connection to database successful!");
});



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

app.listen(3000, ()=> {
    console.log("App is running on port 3000")
})