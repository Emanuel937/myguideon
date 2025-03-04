📚 API Routes Documentation - MyGuideon
🛤️ Endpoints pour activities
1. Récupérer toutes les activités [🔓 Public]
URL: /api/activities
Méthode: GET
Permissions: Aucune
Réponse:
json
Copier
Modifier
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
2. Récupérer une activité par ID [🔓 Public]
URL: /api/activities/:id
Méthode: GET
Permissions: Aucune
Réponse:
json
Copier
Modifier
{
  "id": 1,
  "name": "Scuba Diving",
  "description": "Plongée sous-marine",
  "price": 120.00,
  "currency": "USD"
}
3. Ajouter une nouvelle activité [🔒 Authentification requise]
URL: /api/activities
Méthode: POST
Permissions requises: create_activity
Headers:
makefile
Copier
Modifier
Authorization: Bearer <token>
Body:
json
Copier
Modifier
{
  "name": "Scuba Diving",
  "description": "Plongée sous-marine",
  "price": 120.00,
  "currency": "USD",
  "location": "Maldives",
  "duration": "3h",
  "created_by": 1
}
Réponse (succès):
json
Copier
Modifier
{
  "id": 1,
  "message": "Activité ajoutée avec succès."
}
Réponses (erreurs):
401 Unauthorized:
json
Copier
Modifier
{
  "error": "Access denied"
}
403 Forbidden:
json
Copier
Modifier
{
  "error": "Forbidden"
}
4. Mettre à jour une activité [🔒 Authentification requise]
URL: /api/activities/:id
Méthode: PUT
Permissions requises: update_activity
Headers:
makefile
Copier
Modifier
Authorization: Bearer <token>
Body:
json
Copier
Modifier
{
  "name": "Updated Activity",
  "description": "Updated Description",
  "price": 150.00,
  "currency": "USD",
  "location": "France",
  "duration": "4h",
  "created_by": 1
}
Réponse (succès):
json
Copier
Modifier
{
  "message": "Activité mise à jour avec succès."
}
Réponses (erreurs):
401 Unauthorized:
json
Copier
Modifier
{
  "error": "Access denied"
}
403 Forbidden:
json
Copier
Modifier
{
  "error": "Forbidden"
}
5. Supprimer une activité [🔒 Authentification requise]
URL: /api/activities/:id
Méthode: DELETE
Permissions requises: delete_activity
Headers:
makefile
Copier
Modifier
Authorization: Bearer <token>
Réponse (succès):
json
Copier
Modifier
{
  "message": "Activité supprimée avec succès."
}
Réponses (erreurs):
401 Unauthorized:
json
Copier
Modifier
{
  "error": "Access denied"
}
403 Forbidden:
json
Copier
Modifier
{
  "error": "Forbidden"
}
/*****************************************************************************************************/
/**********************************TEST LOCAL********************************************************/
/*****************************************************************************************************/
🧪 RESULTAT TEST LOCAL POUR activities
plaintext
Copier
Modifier
> myguideon-api@1.0.0 test
> jest

  console.log
    🚀 Server is running on port 3030

  console.log
    Connexion réussie ! Résultat : [ { solution: 2 } ]

 PASS  __tests__/activities.test.js
  📌 Test API Activities
    √ GET /api/activities - devrait retourner toutes les activités (102 ms)
    √ GET /api/activities/:id - devrait retourner une activité avec ses images (9 ms)
    √ POST /api/activities - devrait ajouter une nouvelle activité avec token valide (35 ms)
    √ PUT /api/activities/:id - devrait mettre à jour une activité avec token valide (18 ms)
    √ DELETE /api/activities/:id - devrait supprimer une activité avec token valide (11 ms)
    √ POST /api/activities - devrait échouer sans token (6 ms)
    √ POST /api/activities - devrait échouer avec token invalide (6 ms)
    √ POST /api/activities - devrait échouer sans permissions (7 ms)

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        2.063 s, estimated 3 s
Ran all test suites.