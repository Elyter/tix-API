const express = require('express');
const router = express.Router();

router.get('/ping', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");
    
    res.json({
        "status": "online",
    });
});

module.exports = router;