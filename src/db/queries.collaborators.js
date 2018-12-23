const Collaborator = require("./models").Collaborator;
const User = require("./models").User;

module.exports = {
	getAllCollaborators(wikiId, callback){
		return Collaborator.findAll(
			{where: {wikiId: wikiId}}
		)
		.then((collaborators) => {
			// console.log("collabs :", collaborators.users);
		  	callback(null, collaborators);
		})
		.catch((err) => {
		  	callback(err);
		})
	},
	// getAllCollaborators(wikiId, callback){
	// 	return Collaborator.findAll(
	// 		{where: {wikiId: wikiId}}
	// 	)
	// 	.then((collaborators) => {
	// 		// console.log("COLLABS :",collaborators.users);
	// 		// console.log("COLLABS :",collaborators.userId);
	// 		User.findAll({where: {id: collaborators.userId}})
    //         .then((users) => {
    //           callback(null, users);
    //         })
    //         .catch((err) => {
    //           console.log("err1 :", err);
    //           callback(err);
	// 		})

	// 	})
	// 	.catch((err) => {
	// 	  	callback(err);
	// 	})
	// },
    
	removeCollaborator(req, collaboratorInfo, callback){
		
	}
}