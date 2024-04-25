const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const sql = require('../db/db');

// Définir une route pour servir les images
router.get('/images/events/:imageName', (req, res) => {
    res.header('Content-type', 'image/jpeg');
    res.header('Access-Control-Allow-Origin', "*");

    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'images/events', imageName);

    // Envoyer l'image en réponse
    res.sendFile(imagePath, (err) => {
        if (err) {
            // Gérer les erreurs d'envoi de fichier, par exemple, l'image n'existe pas
            console.error('Erreur lors de l\'envoi de l\'image:', err);
            res.status(404).send('Image non trouvée');
        }
    });
});

router.get('/images/users/:imageName', (req, res) => {
    res.header('Content-type', 'image/jpeg');
    res.header('Access-Control-Allow-Origin', "*");

    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'images/users', imageName);

    // Envoyer l'image en réponse
    res.sendFile(imagePath, (err) => {
        if (err) {
            // Gérer les erreurs d'envoi de fichier, par exemple, l'image n'existe pas
            console.error('Erreur lors de l\'envoi de l\'image:', err);
            res.status(404).send('Image non trouvée');
        }
    });
});

// Endpoint de chargement pour l'image de l'utilisateur
router.post('/images/users', (req, res) => {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

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
        } else {
            // Enrengistrer le nom du fichier dans la base de données
            const imageName = req.file.originalname + "." + req.file.mimetype.split('/')[1];
            sql.query("UPDATE user SET pp = ? WHERE uid = ?", [imageName, req.file.originalname], function(err, result) {
                if (err) {
                    console.error('Erreur lors de l\'enregistrement du nom du fichier:', err);
                    return res.status(500).send({ error: 'Erreur lors de l\'enregistrement du nom du fichier' });
                }

                return res.status(200).send({ message: 'Fichier enregistré avec succès' });
            });
        }
    });
});


module.exports = router;
