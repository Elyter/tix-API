const express = require('express');
const router = express.Router();


/**
 * @swagger
 * /ping:
 *   get:
 *     description: Vérifiez que l'API est en ligne
 *     responses:
 *       200:
 *         description: Succès
 */

router.get('/ping', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");
    
    res.json({
        "status": "online",
    });
});

module.exports = router;