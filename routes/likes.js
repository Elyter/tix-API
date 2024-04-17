const express = require('express');
const router = express.Router();
const moment = require('moment');
require('moment/locale/fr');

const sql = require('../db/db');

router.get('/likes/:uid', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const uid = req.params.uid;

    sql.query("SELECT * FROM likes WHERE uid = ?;", [uid], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la récupération de l\'évènement' });
            return;
        }
        if (result.length > 0) {
            res.status(200).send(result);
            return;
        }
        res.status(404).send({ error: 'Événement non trouvé' });
    });
});

module.exports = router;
