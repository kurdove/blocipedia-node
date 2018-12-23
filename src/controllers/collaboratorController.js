const collaboratorQueries = require("../db/queries.collaborators.js");
const wikiQueries = require("../db/queries.wikis.js");
const User = require("../db/models").User;

module.exports = {
   	show(req, res, next) {
      	collaboratorQueries.getAllCollaborators(req.params.id, (err, collaborators) => {
        	if(err){
         		console.log(err);
            	res.redirect(500, "static/index");
        	} else {
                // // var collabs;
                // for (let i = 0; i < collaborators.length; i++) {
                //     // console.log( collaborators[i].userId);
                //     User.findOne({where: {id: collaborators[i].userId}})
                //     .then((users) => {
                //         console.log("users :", users.name);
                //         var collabs = users;
                //         console.log("collabs :", collabs.name);
                //     })
                // }
                // console.log("collabs2 :", collabs);
                res.render("collaborators/show", {collaborators});
        	}
     	});
    },

    newForm(req, res, next){
        res.render("collaborators/new");
    },
    
    create(req, res, next){
        let newCollaborator = {
            userId: req.body.userId,
            wikiId: req.params.wikiId
        };
        collaboratorQueries.addCollaborator(newCollaborator, (err, collaborator) => {
            if(err){
                req.flash("error", err);
                res.redirect(500, "collaborators/show");
            } else {
                req.flash("notice", "Added as a collaborator");
                res.redirect("/wikis/:id/collaborators");
            }
        });
    },
	// create(req, res, next){
		
    //     collaboratorQueries.addCollaborator(req, req.body, (err, collaborator) => {
    //         if(err){
    //             req.flash("error", err);
    //             res.redirect(500, "collaborators/index");
    //         } else {
    //             req.flash("notice", `Added as a collaborator`);
    //             res.redirect(req.headers.referer);
    //         }
    //     });
		
	// },
	// destroy(req, res, next){
	// 	if(req.user){
	// 		collaboratorQueries.removeCollaborator(req, req.body, (err, collaborator) => {
	// 			if(err){
	// 				req.flash("error", err);
	// 			}
	// 				req.flash("notice", "Removed as a collaborator");
	// 				res.redirect(req.headers.referer);
	// 		});
	// 	} else {
	// 		req.flash("notcie", "must be a user to do that");
	// 		res.redirect(req.headers.referer);
	// 	}
	// }
}