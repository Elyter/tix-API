const express = require('express');
const router = express.Router();
const moment = require('moment');

const sql = require('../db/db');

router.post('/tickets/:uid/:id', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const uid = req.params.uid;
    const id = req.params.id;

    sql.query("SELECT * FROM ticket WHERE uid = ? AND idEvent = ?", [uid, id], function(err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send({ error: 'Erreur lors de la vérification du ticket' });
        }
        if (result.length > 0) {
            return res.status(400).send({ error: 'Ticket déjà acheté' });
        }
        sql.query("INSERT INTO ticket (uid, idEvent) VALUES (?, ?)", [uid, id], function(err, result) {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: 'Erreur lors de l\'achat du ticket' });
            }
            sql.query("SELECT * FROM events WHERE id = ?", [id], function(err, result) {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ error: 'Erreur lors de la récupération de l\'évènement' });
                }
                if (result.length > 0) {
                    return res.status(200).send(result[0]);
                }
                res.status(404).send({ error: 'Événement non trouvé' });
            });
        });
    });
});

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
            return res.status(500).send({ error: 'Erreur lors de la récupération des tickets' });
        }
        if (result.length > 0) {
            result.forEach(event => {
                event.date = moment(event.date).format('dddd DD MMMM [à] HH:mm');
                event.imageUrl = `/images/events/${event.id}.jpeg`;
            });
            return res.status(200).send(result);
        }
        res.status(404).send({ error: 'Aucun ticket trouvé' });
    });
});

module.exports = router;
