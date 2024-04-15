// endpoint pour récuéprer les informations de l'utilisateur avec son uid

const express = require('express');
const router = express.Router();

const sql = require('../db/db');
/**
 * @swagger
 * /userData/{uid}:
 *  get:
 *   description: Récupère les informations de l'utilisateur avec son uid
 *  parameters:
 *   - in: path
 *    name: uid
 *   required: true
 *  description: L'uid de l'utilisateur
 */
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