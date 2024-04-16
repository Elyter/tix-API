const express = require('express');
const router = express.Router();
const moment = require('moment');
require('moment/locale/fr');

const sql = require('../db/db');

router.get('/events/', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    sql.query("SELECT * FROM events", function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la récupération de l\'évènements' });
            return;
        }
        if (result.length > 0) {
            // Formater la date pour chaque événement
            result.forEach(event => {
                event.date = moment(event.date).format('dddd DD MMMM [à] HH:mm');
                event.imageUrl = `/images/events/${event.id}.jpeg`;
            });
            res.status(200).send(result);
            return;
        }
    });
});

module.exports = router;
