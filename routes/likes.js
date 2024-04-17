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
            res.status(500).send({ error: 'Erreur lors de la récupération du like' });
            return;
        }
        if (result.length > 0) {
            res.status(200).send(result);
            return;
        }
        res.status(404).send({ error: 'Événement non trouvé' });
    });
});

router.post('/likes/:uid', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const uid = req.params.uid;
    const eventId = req.body.eventId;
    sql.query("SELECT * FROM likes WHERE uid = ? AND eventId = ?;", [uid, eventId], function(err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send({ error: 'Erreur lors de la récupération de l\'évènement' });
        }
        if (result.length > 0) {
            return sql.query("DELETE FROM likes WHERE uid = ? AND eventId = ?;", [uid, eventId], function(err, result) {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ error: 'Erreur lors de la suppression de like' });
                }
                return res.status(200).send({ message: 'like supprimé' });
            });
        }
        sql.query("INSERT INTO likes (uid, eventId) VALUES (?, ?);", [uid, eventId], function(err, result) {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: 'Erreur lors de l\'enregistrement de like' });
            }
            return res.status(200).send({ message: 'like enregistré' });
        });
    });
});


module.exports = router;
