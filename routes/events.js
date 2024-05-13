const express = require('express');
const router = express.Router();
const moment = require('moment');
require('moment/locale/fr');

const sql = require('../db/db');

// endpoint qui récupète tout les events et leurs informations et qui récupère aussi le nom de l'organistaeur à partir de son id
router.get('/events', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    sql.query("SELECT events.*, organizer.name AS organizerName FROM events INNER JOIN organizer ON events.idOrganizer = organizer.id", function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la récupération des évènements' });
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

// endpoint qui récupère un event et le nom et la photo de profil de l'organisateur à partir de son id
router.get('/events/:id', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const id = req.params.id;

    sql.query("SELECT events.*, organizer.name AS organizerName, organizer.pp AS organizerPP FROM events INNER JOIN organizer ON events.idOrganizer = organizer.id WHERE events.id = ?", [id], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la récupération de l\'évènement' });
            return;
        }
        if (result.length > 0) {
            const event = result[0];
            event.date = moment(event.date).format('dddd DD MMMM [à] HH:mm');
            event.imageUrl = `/images/events/${event.id}.jpeg`;
            res.status(200).send(event);
            return;
        }
        res.status(404).send({ error: 'Événement non trouvé' });
    });
});



router.post('/events', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const eventData = req.body; // Les données fournies dans le corps de la requête   

    eventData.date = moment(eventData.date).format('YYYY-MM-DD HH:mm:ss');

    // Vérifiez si des données sont fournies dans le corps de la requête
    if (Object.keys(eventData).length === 0) {
        return res.status(400).send({ error: 'Aucune donnée fournie pour la création de l\'événement' });
    }

    // Créer une nouvelle entrée dans la base de données et récupérer l'ID de l'événement créé
    sql.query("INSERT INTO events (name, description, date, location, idOrganizer, price) VALUES (?, ?, ?, ?, ?, ?)", [eventData.name, eventData.description, eventData.date, eventData.location, eventData.idOrganizer, eventData.price], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la création de l\'événement' });
            return;
        }
        const eventId = result.insertId;
        res.status(200).send({ eventId: eventId });
    });
});

// une route pour récupérer les événements d'un organisateur avec le nom de l'organisateur à partir de son id avec en paramètre l'id de l'organisateur et si il faut renvoyer tout les évenements ou seulement ceux à venir ou passés et trirer les resultat par date
router.get('/events/organizer/:id/:type', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const id = req.params.id;
    const type = req.params.type;

    let query = "SELECT events.*, organizer.name AS organizerName FROM events INNER JOIN organizer ON events.idOrganizer = organizer.id WHERE idOrganizer = ?";
    if (type === 'past') {
        query += " AND date < NOW()";
    } else if (type === 'upcoming') {
        query += " AND date > NOW()";
    }
    query += " ORDER BY date";

    sql.query(query, [id], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la récupération des évènements' });
            return;
        }
        if (result.length > 0) {
            result.forEach(event => {
                event.date = moment(event.date).format('dddd DD MMMM [à] HH:mm');
                event.imageUrl = `/images/events/${event.id}.jpeg`;
            });
            res.status(200).send(result);
            return;
        }
        res.status(404).send({ error: 'Aucun événement trouvé' });
    });
});

// endpoint pour faire une recherche d'évnènements par nom de l'évènements ou le nom de l'organisateur et par filtre (prix croissant, prix décroissant, date croissante, pas de filtre)
router.get('/events/search/:search/:filter', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const search = req.params.search;
    const filter = req.params.filter;

    let query = "SELECT events.*, organizer.name AS organizerName FROM events INNER JOIN organizer ON events.idOrganizer = organizer.id WHERE events.name LIKE ? OR organizer.name LIKE ?";
    if (filter === 'priceAsc') {
        query += " ORDER BY price";
    } else if (filter === 'priceDesc') {
        query += " ORDER BY price DESC";
    } else if (filter === 'dateAsc') {
        query += " ORDER BY date";
    }

    sql.query(query, [`%${search}%`, `%${search}%`], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la recherche des évènements' });
            return;
        }
        if (result.length > 0) {
            result.forEach(event => {
                event.date = moment(event.date).format('dddd DD MMMM [à] HH:mm');
                event.imageUrl = `/images/events/${event.id}.jpeg`;
            });
            res.status(200).send(result);
            return;
        }
        res.status(404).send({ error: 'Aucun événement trouvé' });
    });
});


module.exports = router;
