const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const sql = require('../db/db');

// Définir une route pour servir les images
function sendImage(req, res, imagePath) {
    // Créer un flux de lecture de l'image
    const imageStream = fs.createReadStream(imagePath);

    // Gérer les erreurs lors de la lecture du fichier
    imageStream.on('error', (err) => {
        console.error('Erreur lors de la lecture du fichier:', err);
        res.status(404).send('Image non trouvée');
    });

    // Événement de fin de lecture du flux
    imageStream.on('end', () => {
        res.end(); // Terminer la réponse lorsque toute l'image a été envoyée
    });

    // Événement de fermeture de la connexion par le client
    res.on('close', () => {
        imageStream.destroy(); // Fermer le flux de lecture de l'image
    });

    // Pipe le flux de lecture de l'image vers la réponse
    imageStream.pipe(res);
}

// Définir les routes GET pour les images
router.get('/images/events/:imageName', (req, res) => {
    res.header('Content-type', 'image/jpeg');
    res.header('Access-Control-Allow-Origin', "*");

    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'images/events', imageName);

    // Envoyer l'image en réponse
    sendImage(req, res, imagePath);
});

router.get('/images/users/:imageName', (req, res) => {
    res.header('Content-type', 'image/jpeg');
    res.header('Access-Control-Allow-Origin', "*");

    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'images/users', imageName);

    // Envoyer l'image en réponse
    sendImage(req, res, imagePath);
});

router.get('/images/organizers/:imageName', (req, res) => {
    res.header('Content-type', 'image/jpeg');
    res.header('Access-Control-Allow-Origin', "*");

    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'images/organizers', imageName);

    // Envoyer l'image en réponse
    sendImage(req, res, imagePath);
});

// Endpoint de chargement pour l'image de l'utilisateur
router.post('/images/users', (req, res) => {
    // Configuration de multer pour stocker les fichiers dans le dossier images/pp
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, path.join(__dirname, 'images/users'));
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname + "." + file.mimetype.split('/')[1]);
        }
    });

    const upload = multer({ storage: storage }).single('image');

    upload(req, res, async function(err) {
        if (err) {
            console.error('Erreur lors de l\'envoi de l\'image:', err);
            return res.status(500).send({ error: 'Erreur lors de l\'envoi de l\'image' });
        }

        // Vérifie si un fichier a été envoyé
        if (!req.file) {
            return res.status(400).send({ error: 'Aucun fichier envoyé' });
        }

        // Enregistrer le nom du fichier dans la base de données
        const imageName = req.file.originalname + "." + req.file.mimetype.split('/')[1];
        sql.query("UPDATE users SET pp = ? WHERE uid = ?", [imageName, req.file.originalname], function(err, result) {
            if (err) {
                console.error('Erreur lors de l\'enregistrement du nom du fichier:', err);
                return res.status(500).send({ error: 'Erreur lors de l\'enregistrement du nom du fichier' });
            }

            // Envoyer la réponse après l'enregistrement réussi du nom du fichier
            res.status(200).send({ message: 'Fichier enregistré avec succès' });
        });
    });
});

router.post('/images/organizers', (req, res) => {
    // Configuration de multer pour stocker les fichiers dans le dossier images/pp
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, path.join(__dirname, 'images/organizers'));
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname + "." + file.mimetype.split('/')[1]);
        }
    });

    const upload = multer({ storage: storage }).single('image');

    upload(req, res, async function(err) {
        if (err) {
            console.error('Erreur lors de l\'envoi de l\'image:', err);
            return res.status(500).send({ error: 'Erreur lors de l\'envoi de l\'image' });
        }

        // Vérifie si un fichier a été envoyé
        if (!req.file) {
            return res.status(400).send({ error: 'Aucun fichier envoyé' });
        }

        // Enregistrer le nom du fichier dans la base de données
        const imageName = req.file.originalname + "." + req.file.mimetype.split('/')[1];
        sql.query("UPDATE organizer SET pp = ? WHERE uid = ?", [imageName, req.file.originalname], function(err, result) {
            if (err) {
                console.error('Erreur lors de l\'enregistrement du nom du fichier:', err);
                return res.status(500).send({ error: 'Erreur lors de l\'enregistrement du nom du fichier' });
            }

            // Envoyer la réponse après l'enregistrement réussi du nom du fichier
            res.status(200).send({ message: 'Fichier enregistré avec succès' });
        });
    });
});

router.post('/images/events', (req, res) => {
    // Configuration de multer pour stocker les fichiers dans le dossier images/pp
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, path.join(__dirname, 'images/events'));
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname + "." + file.mimetype.split('/')[1]);
        }
    });

    const upload = multer({ storage: storage }).single('image');

    upload(req, res, async function(err) {
        if (err) {
            console.error('Erreur lors de l\'envoi de l\'image:', err);
            return res.status(500).send({ error: 'Erreur lors de l\'envoi de l\'image' });
        }

        // Vérifie si un fichier a été envoyé
        if (!req.file) {
            return res.status(400).send({ error: 'Aucun fichier envoyé' });
        }

        // Enregistrer le nom du fichier dans la base de données
        const imageName = req.file.originalname + "." + req.file.mimetype.split('/')[1];
        sql.query("UPDATE events SET pp = ? WHERE id = ?", [imageName, req.file.originalname], function(err, result) {
            if (err) {
                console.error('Erreur lors de l\'enregistrement du nom du fichier:', err);
                return res.status(500).send({ error: 'Erreur lors de l\'enregistrement du nom du fichier' });
            }

            // Envoyer la réponse après l'enregistrement réussi du nom du fichier
            res.status(200).send({ message: 'Fichier enregistré avec succès' });
        });
    });
});


module.exports = router;
