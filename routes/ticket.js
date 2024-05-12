const express = require('express');
const router = express.Router();

const sql = require('../db/db');



// endpoint qui prend en paramètre un uid et un id de l'event pour ajouter un ticket a un utilisateur une seul fois et renvoyer le detail de l'event associé 
router.post('/tickets/:uid/:id', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const uid = req.params.uid;
    const id = req.params.id;

    sql.query("SELECT * FROM ticket WHERE uid = ? AND idEvent = ?", [uid, id], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la vérification du ticket' });
            return;
        }
        if (result.length > 0) {
            res.status(400).send({ error: 'Ticket déjà acheté' });
            return;
        }
        sql.query("INSERT INTO ticket (uid, idEvent) VALUES (?, ?)", [uid, id], function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).send({ error: 'Erreur lors de l\'achat du ticket' });
                return;
            }
            sql.query("SELECT * FROM events WHERE id = ?", [id], function(err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).send({ error: 'Erreur lors de la récupération de l\'évènement' });
                    return;
                }
                if (result.length > 0) {
                    res.status(200).send(result[0]);
                    return;
                }
                res.status(404).send({ error: 'Événement non trouvé' });
            });
        });
    });
});

// endpoint qui prend en parmètre past ou upcoming pour récupérer les tickets d'un utilisateur et renvoyer tout le détail de chaque event associé
router.get('/tickets/:uid/:type', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const uid = req.params.uid;
    const type = req.params.type;

    let query = "SELECT * FROM ticket INNER JOIN events ON ticket.idEvent = events.id WHERE uid = ?";

    if (type === 'past') {
        query += " AND date < NOW()";
    } else if (type === 'upcoming') {
        query += " AND date >= NOW()";
    }

    sql.query(query, [uid], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la récupération des tickets' });
            return;
        }
        if (result.length > 0) {
            res.status(200).send(result);
            return;
        }
        res.status(404).send({ error: 'Aucun ticket trouvé' });
    });
});



module.exports = router;
