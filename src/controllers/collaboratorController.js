const collaboratorQueries = require("../db/queries.collaborators.js");
const wikiQueries = require("../db/queries.wikis.js");

module.exports = {
   	show(req, res, next) {
      	collaboratorQueries.getAllCollaborators((err, users) => {
        	if(err){
         		console.log(err);
            	res.redirect(500, "static/index");
        	} else {
                res.render("collaborators/show", {users});
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