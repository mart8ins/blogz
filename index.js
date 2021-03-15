const express = require("express");
const engineMate = require("ejs-mate");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs"); // to render files without extension
app.engine("ejs", engineMate); // use ejs-locals for all ejs templates
app.set("views",__dirname + "/views");


let categorie = "";

app.get("/", (req, res)=> {
    res.render("home")
})

app.get("/blog", (req, res)=> {
    res.render("blog/blog", {categorie})
})

app.post("/blog", (req, res)=> {
categorie = req.body.categorie;
    res.redirect("/blog");
})

app.listen(3000, ()=> {
    console.log("App is running on port 3000")
})