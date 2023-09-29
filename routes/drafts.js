const express = require("express");
const {
  addDraft,
  deleteDarft,
  getDraft,
  getDrafts,
  updateDraft,
} = require("../controller/draft.js");

const router = express.Router();

router.get("/", getDrafts);
router.get("/:id", getDraft);
router.post("/", addDraft);
router.delete("/:id", deleteDarft);
router.put("/:id", updateDraft);

module.exports = router;
