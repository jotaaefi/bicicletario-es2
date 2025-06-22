const express = require("express");
const router = express.Router();
const databaseUtils = require("../utils/database");

router.get("/restaurarBanco", async (req, res) => {
   await databaseUtils.restoresDatabase();
    res.status(200).send("Database restored successfully.");
});

module.exports = router;