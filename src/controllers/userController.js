const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
    signUp(req, res, next){
        res.render("users/signup");
    },

    create(req, res, next){
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password_conf: req.body.password_conf
        };
            userQueries.createUser(newUser, (err, user) => {
            if(err){
                req.flash("error", err);
                res.redirect("/users/sign_up");
            } else {
                passport.authenticate("local")(req, res, () => {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
                })
            }
        });
    },

    signInForm(req, res, next){
        res.render("users/signin");
    },

    signIn(req, res, next){
        passport.authenticate("local")(req, res, function () {
            if(!req.user){
                req.flash("notice", "Sign in failed. Please try again.")
                res.redirect("/users/sign_in");
            } else {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
            }
        })
    },

    signOut(req, res, next){
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },

    upgrade(req, res, next) {
                
        userQueries.upgradeUser(req, (err, user) => {
            if(err || user == null) {
                res.redirect(401, '/');
            } else {
                req.flash('notice', 'Your account has been upgraded! You will receive a confirmation email shortly.')
                res.redirect(`/users/${req.params.id}`);
            }
        });
    },

    downgrade(req, res, next) {
        userQueries.downgradeUser(req, (err, user) => {
            if(err || user == null) {
                // console.log(err);
                req.flash("error", err);
                res.redirect(err, '/');
            } else {
                req.flash('notice','Your account has been downgraded');
                res.redirect(`/users/${req.params.id}`);
            }
        });
    },

    show(req, res, next) {
        userQueries.getUser(req.params.id, (err, result) => {
            console.log(result);
            if(err || result.user === undefined) {
                req.flash('notice', 'User not found');
                res.redirect('/');
            } else {
                res.render('users/show', {user});
            }
        });
    }
}