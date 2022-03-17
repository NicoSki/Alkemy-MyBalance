const passport = require("passport");
const Local = require("passport-local").Strategy;

const User = require("../models/user");

passport.use(new Local({
    usernameField: "email",

}, async (email, password, done) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        return done(null, false, {});
    } else {
        const match = await user.matchPassword(password);
        if (match) {
            return done(null, user);
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
        done(error, user);
    });
});