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

router.get('/events/:id', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const id = req.params.id;

    sql.query("SELECT * FROM events WHERE id = ?", [id], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la récupération de l\'évènement' });
            return;
        }
        if (result.length > 0) {
            // Formater la date pour l'événement
            result[0].date = moment(result[0].date).format('dddd DD MMMM [à] HH:mm');
            result[0].imageUrl = `/images/events/${id}.jpeg`;
            res.status(200).send(result[0]);
            return;
        }
        res.status(404).send({ error: 'Événement non trouvé' });
    });
});

router.post('/events', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const eventData = req.body; // Les données fournies dans le corps de la requête   

    eventData.date = moment(eventData.date, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');

    console.log(eventData);

    // Vérifiez si des données sont fournies dans le corps de la requête
    if (Object.keys(eventData).length === 0) {
        return res.status(400).send({ error: 'Aucune donnée fournie pour la création de l\'événement' });
    }

    // Créer une nouvelle entrée dans la base de données
    sql.query("INSERT INTO events (name, description, date, location, idOrganizer, price) VALUES (?, ?, ?, ?, ?, ?)", [eventData.name, eventData.description, eventData.date, eventData.location, eventData.idOrganizer, eventData.price], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la création de l\'événement' });
            return;
        }
        console.log(result);
        res.status(200).send({ message: 'Événement créé' });
    });
});

// une route pour récupérer les événements d'un organisateur avec en paramètre l'id de l'organisateur et si il faut renvoyer tout les évenements ou seulement ceux à venir ou passés et trirer les resultat par date
router.get('/events/organizer/:id/:filter', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const id = req.params.id;
    const filter = req.params.filter;

    let query = "SELECT * FROM events WHERE idOrganizer = ?";
    if (filter === 'upcoming') {
        query += " AND date > NOW() ORDER BY date";
    } else if (filter === 'past') {
        query += " AND date < NOW() ORDER BY date DESC";
    } else {
        query += " ORDER BY date";
    }

    sql.query(query, [id], function(err, result) {
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
