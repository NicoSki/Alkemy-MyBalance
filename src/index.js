const express = require("express");
const path = require("path");
const ejs = require("ejs");
const session = require("express-session");





//Variables
const app = express();

//Call the DB
require("./database");



//Settings
const PORT = 8080;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



//Routes
app.use(require("./routes/index"));
app.use(require("./routes/balance"));



//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "balanceApp",
    resave: true,
    saveUninitialized: true
}));


//Global variables:
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg");
    next();
});


//Static Files
app.use(express.static(path.join(__dirname + '/public')));


//Server
app.listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}`);
})
