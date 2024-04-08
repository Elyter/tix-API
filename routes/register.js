const express = require('express');
const router = express.Router();
const sql = require('../db/db');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

router.post('/register', async function(req, res) {
  res.header('Content-type', 'application/json');
  res.header('Access-Control-Allow-Origin', "*");

  const uid = req.body.uid;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;

  try {
    // Check if UID exists in Firebase
    const userRecord = await admin.auth().getUser(uid);
    if (userRecord) {
      // UID exists, check if user already registered in database
      sql.query("SELECT * FROM users WHERE uid = ?", [uid], function(err, result) {
        if (err) {
          console.log(err);
          res.status(500).send({ error: 'Erreur lors de la récupération de l\'utilisateur' });
          return;
        }
        if (result.length > 0) {
          res.status(400).send({ error: 'Cet utilisateur existe déjà' });
          return;
        }
        // Insert user into database
        sql.query("INSERT INTO users (uid, firstName, lastName, username) VALUES (?, ?, ?, ?)", [uid, firstName, lastName, username], function(err, result) {
          if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
            return;
          }
          res.status(200).send({ message: 'Utilisateur enregistré' });
        });
      });
    } else {
      // UID doesn't exist in Firebase
      res.status(400).send({ error: 'Cet utilisateur n\'existe pas' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send({ error: 'Erreur lors de la vérification de l\'utilisateur dans Firebase' });
  }
});

module.exports = router;
