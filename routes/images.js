const express = require('express');
const router = express.Router();
const path = require('path');

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

module.exports = router;