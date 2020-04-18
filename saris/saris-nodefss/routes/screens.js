const express = require('express');
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const router = express.Router();

// appDir/data/screens/...

const basePath = path.resolve(appRoot, "data/fs/screens");

router.get('/:screenId', function(req, res, next) {
    const screenId = req.params["screenId"];
    const screenPath = path.normalize(screenId + ".yaml");
    res.sendFile(screenPath, {root: basePath});
});

module.exports = router;
