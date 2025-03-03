📚 API Routes Documentation - MyGuideon

🛤️ Endpoints pour activities

1. Récupérer toutes les activités

URL: /api/activities

Méthode: GET

Réponse:

[
  {
    "id": 1,
    "name": "Scuba Diving",
    "description": "Plongée sous-marine aux Maldives",
    "price": 120.00,
    "currency": "USD",
    "images": [
      {
        "id": 1,
        "url": "/images/scuba.jpg",
        "alt_text": "Plongée sous-marine"
      }
    ]
  }
]

2. Récupérer une activité par ID

URL: /api/activities/:id

Méthode: GET

Réponse:

{
  "id": 1,
  "name": "Scuba Diving",
  "description": "Plongée sous-marine",
  "price": 120.00,
  "currency": "USD"
}

3. Ajouter une nouvelle activité

URL: /api/activities

Méthode: POST

Body:

{
  "name": "Scuba Diving",
  "description": "Plongée sous-marine",
  "price": 120.00,
  `currency`: La devise utilisée (`USD` ou `EUR` seulement).
}

Réponse:

{
  "id": 1,
  "message": "Activité ajoutée avec succès."
}

4. Mettre à jour une activité

URL: /api/activities/:id

Méthode: PUT

Body:

{
  "name": "Updated Activity"
}

Réponse:

{
  "message": "Activité mise à jour avec succès."
}

5. Supprimer une activité

URL: /api/activities/:id

Méthode: DELETE

Réponse:

{
  "message": "Activité supprimée avec succès."
}
/************************************************************************/
/************************************************************************/
/************************************************************************/
/ ************************************************************************/
RESULTAT TEST LOCAL POUR activities : 

 (crud-activities)
$ npm run test

> myguideon-api@1.0.0 test
> jest

  console.log
    🚀 Server is running on port 3030

      at Server.log (server.js:24:11)

  console.log
    Connexion réussie ! Résultat : [ { solution: 2 } ]

      at log (database/client.js:45:13)

 PASS  tests/activities.test.js
  📌 Test API Activities
    √ GET /api/activities - devrait retourner toutes les activités (111 ms)                                                                 
    √ GET /api/activities/:id - devrait retourner une activité (11 ms)
    √ POST /api/activities - devrait ajouter une nouvelle activité (28 ms)                                                                  
    √ PUT /api/activities/:id - devrait mettre à jour une activité (12 ms)                                                                  
    √ DELETE /api/activities/:id - devrait supprimer une activité (11 ms)                                                                   

Test Suites: 1 passed, 1 total                                        
Tests:       5 passed, 5 total                                        
Snapshots:   0 total
Time:        1.999 s, estimated 2 s
Ran all test suites.

/************************************************************************/
/************************************************************************/
/************************************************************************/
/ ************************************************************************/