const express = require("express");
const engineMate = require("ejs-mate");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs"); // to render files without extension
app.engine("ejs", engineMate); // use ejs-locals for all ejs templates
app.set("views",__dirname + "/views");




/* *********
ROUTES IMPORTS 
************* */
const blogRoutes = require("./routes/blogs");
const homeRoute = require("./routes/home");

/* *********
ROUTES USE
************* */
app.use("/", homeRoute);
app.use("/", blogRoutes);

app.get("*", (req, res)=> {
    res.send("UPS, 404")
})

app.listen(3000, ()=> {
    console.log("App is running on port 3000")
})