const User = require("./models").User;
const Wiki = require("./models").Wiki;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');

module.exports = {
    createUser(newUser, callback){
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword,
            role: 'standard'
        })
        .then((user) => {
            
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: user.email,
                from: 'evgheni@blocipedia.com',
                subject: 'Welcome to Blocipedia!',
                text: `We are welcome you ${user.name} to Blocipedia !`,
                html: `<strong>Welcome to Blocipedia ${user.name}!</strong>`,
            };
            sgMail.send(msg);

            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        })
    },

    upgradeUser(req, callback) {
        return User.findById(req.params.id)
           .then((user) => {
            if(!user) {
            return callback('User not found');
            } else {
                return user.update({role: 'premium'})
                .then(() => {
                    callback(null, user);
                })
                .catch((err) => {
                    callback(err);
                });
            }
        });
    },

    downgradeUser(req, callback) {
        return User.findById(req.params.id)
           .then((user) => {
            if(!user) {
            return callback('User not found');
            } else {
                return user.update({role: 'standard'})
                .then(() => {
                    callback(null, user);
                })
                .catch((err) => {
                    callback(err);
                });
            }
        });
    },

    getUser(id, callback){
		return User.findById(id, {
            include: [
              {model: Wiki, as: "wikis"}
            ]
        })
		.then((user) => {
			callback(null, user);
		})
		.catch((err) => {
			callback(err);
		});
	},

}