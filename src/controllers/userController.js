const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');

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
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                    to: user.email,
                    from: 'evgheni@blocipedia.com',
                    subject: 'Welcome to Blocipedia!',
                    text: `We are welcome you ${user.name} to Blocipedia !`,
                    html: `<strong>Welcome to Blocipedia ${user.name}!</strong>`,
                };
                sgMail.send(msg);
                res.redirect("/");
                })
            }
        });
    }
}