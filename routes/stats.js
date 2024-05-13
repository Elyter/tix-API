const express = require('express');
const router = express.Router();

const sql = require('../db/db');

// endpoint qui prend en parmètre l'uid de l'utilisateur et renvoie le nombre de tickets achetés dans la table ticket et le nombres de likes dans la tables likes et le nombre d'abonnement dans la table follow
router.get('/stats/:uid', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const uid = req.params.uid;

    sql.query("SELECT COUNT(*) as tickets FROM ticket WHERE uid = ?", [uid], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la récupération des tickets' });
            return;
        }
        const tickets = result[0].tickets;

        sql.query("SELECT COUNT(*) as likes FROM likes WHERE uid = ?", [uid], function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).send({ error: 'Erreur lors de la récupération des likes' });
                return;
            }
            const likes = result[0].likes;

            sql.query("SELECT COUNT(*) as followers FROM follows WHERE uid = ?", [uid], function(err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).send({ error: 'Erreur lors de la récupération des followers' });
                    return;
                }
                const followers = result[0].followers;

                res.status(200).send({ tickets, likes, followers });
            });
        });
    });
});

// endpoint qui prend en parmètre l'id de l'organisateur et renvoie le nombre de followers dans la table follow
router.get('/stats/followers/:id', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const id = req.params.id;

    sql.query("SELECT COUNT(*) as followers FROM follows WHERE idOrganizer = ?", [id], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la récupération des followers' });
            return;
        }
        const followers = result[0].followers;

        res.status(200).send({ followers });
    });
});
module.exports = router;
