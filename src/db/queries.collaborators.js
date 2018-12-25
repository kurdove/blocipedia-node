const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;

module.exports = {
	getAllCollaborators(wikiId, callback){
		return Collaborator.findAll(
			{where: {wikiId: wikiId}}
		)
		.then((collaborators) => {
		  	callback(null, collaborators);
		})
		.catch((err) => {
		  	callback(err);
		})
	},

	removeCollaborator(wikiId, collabName, callback) {
		return Collaborator.findOne({
			where: {
				wikiId: wikiId,
				collabName: collabName
			}
		})
		.then((collab) => {
			if(collab){
				Collaborator.destroy({
					where: {
						id: collab.id
					}
				})
				.then((collab) => {
					callback(null, collab);
				})
				.catch((err) => {
					console.log("ERR2 :", err);
					callback(err);
				})
			} else {
				callback("error", "Collaborator is no longer on this wiki");
			}
		}) 
		.catch((err) => {
			console.log("ERR2 :", err);
		  	callback(err);
		});
	},
}