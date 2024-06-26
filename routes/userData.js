// endpoint pour récuéprer les informations de l'utilisateur avec son uid

const express = require('express');
const router = express.Router();

const sql = require('../db/db');


router.get('/userData/:uid', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const uid = req.params.uid;

    sql.query("SELECT * FROM users WHERE uid = ?", [uid], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de la récupération de l\'utilisateur' });
            return;
        }
        if (result.length > 0) {
            res.status(200).send(result[0]);
            return;
        }
        res.status(404).send({ error: 'Utilisateur non trouvé' });
    });
});

router.put('/userData/:uid', function(req, res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");

    const uid = req.params.uid;
    const userDataToUpdate = req.body; // Les données fournies dans le corps de la requête

    // Vérifiez si des données sont fournies dans le corps de la requête
    if (Object.keys(userDataToUpdate).length === 0) {
        return res.status(400).send({ error: 'Aucune donnée fournie pour la mise à jour' });
    }

    let updateFields = [];
    let updateValues = [];

    // Construisez dynamiquement la requête SQL en fonction des valeurs fournies
    for (const [key, value] of Object.entries(userDataToUpdate)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
    }

    // Ajoutez l'identifiant de l'utilisateur à la liste des valeurs à mettre à jour
    updateValues.push(uid);

    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE uid = ?`;

    // Exécutez la requête SQL avec les valeurs appropriées
    sql.query(updateQuery, updateValues, function(err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
        }
        res.status(200).send({ message: 'Utilisateur mis à jour' });
    });
});


module.exports = router;