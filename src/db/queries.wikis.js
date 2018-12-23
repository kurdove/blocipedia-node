const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const User = require("./models").User;
const Public = require('../policies/application');
const Private = require('../policies/privateWikis');

module.exports = {
  getAllWikis(callback){
    return Wiki.all()
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
  },

  addWiki(newWiki, callback){
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      userId: newWiki.userId,
      private: newWiki.private
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getWiki(id, callback){
    return Wiki.findById(id, {
      include: [{model: Collaborator, as: "collaborators"}]
    })
    .then((wiki) => {
      // console.log('collaborators', wiki.collaborators);
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteWiki(req, callback) {
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      var authorized;

      if(!req.body.private || req.body.private == 'false') {
        authorized = new Public(req.user, wiki).destroy();
          
      } else {
        authorized = new Private(req.user, wiki).destroy();
      }

      if(authorized) {
        return wiki.destroy()
        .then((res) => {
          callback(null, wiki);
        })
      } else {
        req.flash('notice', 'You are not authorized to do that.');
        callback(401);
      }      
    }) 
    .catch((err) => {
      callback(err);
    });
  },

  updateWiki(req, updatedWiki, callback) {
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      

      if(!wiki) {
        return callback('Wiki not found');
      }

      var authorized;
      if(wiki.private == false) {
        authorized = new Public(req.user, wiki).update();
      } else {
        authorized = new Private(req.user, wiki).update();
      }

      if(authorized) {
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then((wiki) =>{
          User.findOne({where: {name: updatedWiki.collaborator}})
          .then((user) => {
            Collaborator.create({
              userId: user.id,
              wikiId: wiki.id
            })
            .then(() => {
              callback(null, user);
            })
            .catch((err) => {
              console.log("err1 :", err);
              callback(err);
            })
          })
        })
        .catch((err) => {
          console.log("err2 :", err);
          callback(err);
        });
      } else {
        req.flash('notice', 'You are not authorized to do that.');
        callback('Forbidden');
      } 
    });
  }
}