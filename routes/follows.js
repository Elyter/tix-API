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

    sql.query("SELECT * FROM follows WHERE uid = ? AND idOrganizer = ?", [uid, id], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la vérification du follow' });
            return;
        }
        if (result.length > 0) {
            sql.query("DELETE FROM follows WHERE uid = ? AND idOrganizer = ?", [uid, id], function(err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).send({ error: 'Erreur lors du unfollow' });
                    return;
                }
                res.status(200).send({ message: 'Unfollow effectué' });
            });
            return;
        }
        sql.query("INSERT INTO follows (uid, idOrganizer) VALUES (?, ?)", [uid, id], function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).send({ error: 'Erreur lors du follow' });
                return;
            }
            res.status(200).send({ message: 'Follow effectué' });
        });
    });
});

// endpoint pour récupérer le nom et la pp de chaque followers d'un organisateur
// router.get('/follows/followers/:id', function(req, res) {
//     res.header('Content-type', 'application/json');
//     res.header('Access-Control-Allow-Origin', "*");

//     const id = req.params.id;

//     sql.query("SELECT users.uid, users.firstName, users.lastName, users.pp FROM users INNER JOIN follows ON users.uid = follows.uid WHERE idOrganizer = ?", [id], function(err, result) {
//         if (err) {
//             console.log(err);
//             res.status(500).send({ error: 'Erreur lors de la récupération des followers' });
//             return;
//         }
//         if (result.length > 0) {
//             res.status(200).send(result);
//             return;
//         }
//     });
// });

// endpoint pour récupérer le nom et la pp de chaque organisteurs que follow un utilisateur
router.get('/follows/following/:uid', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const uid = req.params.uid;

    sql.query("SELECT organizer.id, organizer.name, organizer.pp FROM organizer INNER JOIN follows ON organizer.id = follows.idOrganizer WHERE follows.uid = ?", [uid], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la récupération des following' });
            return;
        }
        if (result.length > 0) {
            res.status(200).send(result);
            return;
        }
    });
});


module.exports = router;
