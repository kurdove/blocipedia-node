const Collaborator = require("./models").Collaborator;
const User = require("./models").User;

module.exports = {
	getAllCollaborators(callback){
		return User.all({
			include: [{
				model: Collaborator,
				as: "collaborators"
			}]
		})
		.then((users) => {
			callback(null, users);
		})
		.catch((err) => {
			callback(err);
		});
    },
    addCollaborator(newCollaborator, callback){
        
        return Collaborator.create({
            userId: newCollaborator.userId,
            wikiId: newCollaborator.wikiId
        })
        .then((collaborator) => {
            callback(null, collaborator);
        })
        .catch((err) => {
            callback(err);
        })
    },
	// addCollaborator(req, collaboratorInfo, callback){
    //     return Collaborator.findOne({
	// 		where: {
	// 			wikiId: req.params.wikiId,
	// 			userId: req.body.id
	// 		}
	// 	})
	// 	.then((collaborator) => {
	// 		if(!collaborator){
	// 			Collaborator.create({
	// 				wikiId: req.params.wikiId,
	// 				userId: req.body.id
	// 			})
	// 			.then((collaborator) => {
	// 				callback(null, collaborator);
	// 			})
	// 			.catch((err) => {
	// 				callback(err);
	// 			});
	// 		} else {
	// 			callback("error", "Collab already on this wiki");
	// 		}
	// 	})
	
    // },
    
	removeCollaborator(req, collaboratorInfo, callback){
		
	}
}