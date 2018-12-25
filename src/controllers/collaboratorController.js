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
                res.render("collaborators/show", {collaborators});
        	}
     	});
    },

	destroy(req, res, next){
		if(req.user){
            collaboratorQueries.removeCollaborator(req.params.id, req.body.collabName, (err, collaborator) => {
            if(err){
                req.flash("error", err);
            }
                req.flash("notice", "Removed as a collaborator");
                res.redirect(req.headers.referer);
            });
		} else {
			req.flash("notcie", "must be a user to do that");
			res.redirect(req.headers.referer);
		}
	}
}