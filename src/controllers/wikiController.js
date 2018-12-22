const wikiQueries = require("../db/queries.wikis.js");
const Authorized = require('../policies/application.js');
const Private = require('../policies/privateWikis.js');
const markdown = require( "markdown" ).markdown;

module.exports = {
    index(req, res, next){
        wikiQueries.getAllWikis((err, wikis) => {
            if(err){
                res.redirect(500, "static/index");
            } else {
                res.render("wikis/index", {wikis});
            }
        })
    },

    new(req, res, next){
        const authorized = new Authorized(req.user).new();

        if(authorized){
            res.render("wikis/new");
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },

    create(req, res, next){
        var authorized = new Authorized(req.user).create();

        if(authorized) {
            let newWiki = {
            title: req.body.title,
            body: markdown.toHTML(req.body.body),
            userId: req.user.id,
            private: req.body.private || false
            };
            wikiQueries.addWiki(newWiki, (err, wiki) => {
                if(err){
                    res.redirect(500, "/wikis/new");
                } else {
                    res.redirect(303, `/wikis/${wiki.id}`);
                }
            });
        }else{
            req.flash('notice', 'You are not authorized to do that.');
            res.redirect(`/wikis`);
        }
    },

    show(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/");
            } else if(wiki.private == true){
                const authorized = new Authorized(req.user).show();

                if(authorized) {
                    res.render('wikis/show', {wiki});
                } else {
                    req.flash('notice', 'You are not authorized to view this wiki');
                    res.redirect('/wikis');
                }
            } else {
                res.render("wikis/show", {wiki});
            }
        });
    },

    destroy(req, res, next){
        wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
            if(err){
                res.redirect(500, `/wikis/${wiki.id}`)
            } else {
                res.redirect(303, "/wikis")
            }
        });
    },

    edit(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            var authorized;
  
            if(wiki.private == true) {
            authorized = new Private(req.user, wiki).edit();
            } else {
                authorized = new Authorized(req.user, wiki).edit();
            }

            if(authorized) {
            wikiQueries.getWiki(req.params.id, (err, wiki) => {
                if(err || wiki == null) {
                    res.redirect(404, `/wikis`);
                } else {
                    res.render('wikis/edit', {wiki});
                    }
            }); 
            } else {
                req.flash('notice', 'You are not authorized to do that');
                res.redirect(`/wikis/${wiki.id}`);
            }
        })
    },

    update(req, res, next){
        wikiQueries.updateWiki(req, req.body, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(401, `/wikis/${req.params.id}/edit`);
            } else {
                res.redirect(`/wikis/${req.params.id}`);
            }
        });
    }
}