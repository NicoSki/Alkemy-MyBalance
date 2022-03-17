const express = require("express");
const router = express.Router();
const Cap = require("../models/capital");
const Exp = require("../models/expense");
const methodOverride = require('method-override');
const session = require("express-session");
const flash = require("connect-flash");




//Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride('_method'));
router.use(session({
    secret: "balanceApp",
    resave: true,
    saveUninitialized: true
}));
router.use(flash());


//Global variables:
router.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.edit_msg = req.flash("edit_msg");
    res.locals.deleted_msg = req.flash("deleted_msg");
    next();
});


router.get("/balance", async (req, res) => {
    const capital = await Cap.find().sort();
    const expense = await Exp.find().sort();
    const inTable = await Exp.find().sort({ date: "desc" });


    let totalPrice = expense.map(e => e.price)
    let finalPrice = totalPrice.reduce((a, b) => a + b, 0);

    res.render("insideApp", { capital, expense, finalPrice, inTable })
});


/*-------------------------
          CAPITAL
--------------------------*/

router.get("/balance/capitalForm", (req, res) => {
    res.render("forms/capital")
});

router.post("/balance/newCapital", async (req, res) => {
    const { money } = req.body;

    const newCapital = new Cap({ money });
    await newCapital.save();
    req.flash("success_msg", "Your capital has been changed");
    res.redirect("/balance");
})



/*-------------------------
          EXPENSES
--------------------------*/
router.get("/balance/expensesForm", (req, res) => {
    res.render("forms/expense")
});

router.post("/balance/newExpense", async (req, res) => {
    const { description, price, date, kind } = req.body
    const newExpense = new Exp({ description, price, date, kind });
    await newExpense.save();
    req.flash("success_msg", "Your expense was added successfully");
    res.redirect("/balance");
});


/*---------------------
         CRUD
----------------------*/
router.get("/balance/showMoves", async (req, res) => {
    const expenses = await Exp.find().sort({ date: "desc" });
    res.render("moves", { expenses });
});


router.get("/balance/showMoves/edit/:id", async (req, res) => {
    const original = await Exp.findById(req.params.id);
    res.render("crud/edit", { original });
});

router.put("/balance/edit/:id", async (req, res) => {
    const { description, price, date } = req.body;
    await Exp.findByIdAndUpdate(req.params.id, { description, price, date });
    req.flash("edit_msg", "Your expense was edited successfully");
    res.redirect("/balance/showMoves");
});

router.delete("/balance/delete/:id", async (req, res) => {
    await Exp.findByIdAndDelete(req.params.id);
    req.flash("deleted_msg", "Your expense was deleted successfully");
    res.redirect("/balance/showMoves");
})


module.exports = router;

