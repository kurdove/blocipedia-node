const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : wikis", () => {
    beforeEach((done) => {
        this.wiki;
        sequelize.sync({force: true}).then((res) => {
  
            Wiki.create({
            title: "Wiki test",
            body: "Dummy test for test"
            })
            .then((wiki) => {
                this.wiki = wiki;
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
  
        });
  
    });

    describe("GET /wikis", () => {

        it("should return a status code 200 and all wikis", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Wikis");
                expect(body).toContain("Wiki test")
                done();
            });
        });

    });

    describe("GET /wikis/new", () => {

        it("should render a new wiki form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Wiki");
                done();
            });
        });
    
    });

    describe("POST /wikis/create", () => {
        const options = {
          url: `${base}create`,
          form: {
            title: "Tests title 2",
            body: "Dummy body for test 2"
          }
        };
  
        it("should create a new wiki and redirect", (done) => {
  
            request.post(options, (err, res, body) => {
                Wiki.findOne({where: {title: "Tests title 2"}})
                .then((wiki) => {
                    expect(res.statusCode).toBe(303);
                    expect(wiki.title).toBe("Tests title 2");
                    expect(wiki.body).toBe("Dummy body for test 2");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
                }
            );
        });

    });

    describe("GET /wikis/:id", () => {

        it("should render a view with the selected wiki", (done) => {
            request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Wiki test");
                done();
            });
        });
   
    });

    describe("POST /wikis/:id/destroy", () => {

        it("should delete the wiki with the associated ID", (done) => {
            Wiki.all()
            .then((wikis) => {
                const wikiCountBeforeDelete = wikis.length;

                expect(wikiCountBeforeDelete).toBe(1);
                request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                    Wiki.all()
                    .then((wikis) => {
                        expect(err).toBeNull();
                        expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                        done();
                    })

                });
            });
        });
   
    });

    describe("GET /wikis/:id/edit", () => {

        it("should render a view with an edit wiki form", (done) => {
            request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Wiki");
                expect(body).toContain("Wiki test");
                done();
            });
        });
   
    });

    describe("POST /wikis/:id/update", () => {

        it("should update the wiki with the given values", (done) => {
           const options = {
              url: `${base}${this.wiki.id}/update`,
              form: {
                title: "Test title 03",
                body: "Dummy text for edit test"
              }
            };
            request.post(options, (err, res, body) => {
              expect(err).toBeNull();
              Wiki.findOne({
                where: { id: this.wiki.id }
              })
              .then((wiki) => {
                expect(wiki.title).toBe("Test title 03");
                done();
              });
            });
        });
   
    });
});