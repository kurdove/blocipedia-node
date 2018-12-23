const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");

router.get("/wikis/:id/collaborators", collaboratorController.show);
// router.get("/wikis/:id/collaborators/new", collaboratorController.newForm);
// router.post("/wikis/:id/collaborators/create", collaboratorController.create);
// router.post("/wikis/:wikiId/collaborators/destroy", collaboratorController.destroy);

module.exports = router;