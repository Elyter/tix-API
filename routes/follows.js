const express = require('express');
const router = express.Router();

const sql = require('../db/db');

router.get('/follows/:uid', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const uid = req.params.uid;

    sql.query("SELECT * FROM follows WHERE uid = ?", [uid], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la récupération des follows' });
            return;
        }
        if (result.length > 0) {
            res.status(200).send(result);
            return;
        }
    });
});

router.post('/follows/:uid/:id', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const uid = req.params.uid;
    const id = req.params.id;

    sql.query("SELECT * FROM follows WHERE uid = ? AND id = ?", [uid, id], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la vérification du follow' });
            return;
        }
        if (result.length > 0) {
            sql.query("DELETE FROM follows WHERE uid = ? AND id = ?", [uid, id], function(err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).send({ error: 'Erreur lors du unfollow' });
                    return;
                }
                res.status(200).send({ message: 'Unfollow effectué' });
            });
            return;
        }
        sql.query("INSERT INTO follows (uid, id) VALUES (?, ?)", [uid, id], function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).send({ error: 'Erreur lors du follow' });
                return;
            }
            res.status(200).send({ message: 'Follow effectué' });
        });
    });
});

module.exports = router;
