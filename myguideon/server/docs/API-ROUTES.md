                                    📚 API Routes Documentation - MyGuideon

/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/
###########################################🛤️ Endpoints pour activities ##############################
🛤️ Base URL
/api
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
##############################🧪 RESULTAT TEST LOCAL POUR activities ###################################
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

########################################################################################################################


🛤️ Base URL
/api
###########################################🛤️ Endpoints pour userpro  ##############################
🛤️ Base URL
/api/userpro

🟢 Routes Publiques

🔓 POST /register

Inscription d'un utilisateur pro avec upload d'image

URL : /api/userpro/register

Méthode : POST

Headers : Aucun

Body (form-data) :

name : Nom de l'utilisateur

email : Email

password : Mot de passe

profile_image : Image de profil (file)

Réponse :

{
  "id": 1,
  "token": "<JWT Token>"
}

🔓 POST /login

Connexion d'un utilisateur pro

URL : /api/userpro/login

Méthode : POST

Body :

{
  "email": "test@example.com",
  "password": "password123"
}

Réponse :

{
  "token": "<JWT Token>"
}

🔒 Routes Protégées pour User Connecté

🔒 GET /me

Récupérer ses propres infos

Headers :

Authorization: Bearer <token>

Réponse :

{
  "id": 1,
  "name": "Test User",
  "email": "test@example.com"
}

🔒 PUT /me

Mettre à jour ses propres infos

Headers : Authorization: Bearer <token>

Body (form-data) :

name (optionnel)

email (optionnel)

profile_image (optionnel)

Réponse : 200 OK

🔒 PUT /me/password

Mettre à jour son propre mot de passe

Headers : Authorization: Bearer <token>

Body :

{
  "old_password": "ancienmdp",
  "new_password": "nouveaumdp"
}

Réponse : 200 OK

🔒 Routes Admin Sécurisées

🔒 GET /

Récupérer tous les userpro (admin seulement)

Headers : Authorization: Bearer <token>

Réponse :

[
  {
    "id": 1,
    "name": "Admin User"
  }
]

🔒 GET /:id

Récupérer un userpro par ID (admin seulement)

Headers : Authorization: Bearer <token>

Réponse : 200 OK

🔒 PUT /:id

Mettre à jour un userpro par ID (admin seulement)

Headers : Authorization: Bearer <token>

Body (form-data) :

name, email, profile_image

🔒 DELETE /:id

Supprimer un userpro par ID (admin seulement)

Headers : Authorization: Bearer <token>

Réponse : 200 OK

/*****************************************************************************************************/
/**********************************TEST LOCAL********************************************************/
/*****************************************************************************************************/
##############################🧪 RESULTAT TEST LOCAL POUR userpro ###################################

$ npx jest -- __tests__/userpro.test.js
  console.log
    🔑 Token Admin : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGVfaWQiOjEsImlhdCI6MTc0MTE4MDI3NywiZXhwIjoxNzQxMTg3NDc3fQ.pDEHel5wy5pocu9KbXUAobdreWGo_Ac4k3LegCm0aRY

      at Object.log (__tests__/userpro.test.js:16:9)

  console.log
    🔑 Token UserPro : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0ZXN0dXNlcnByb0BleGFtcGxlLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc0MTE4MDI3NywiZXhwIjoxNzQxMTg3NDc3fQ.fY_C_nAtf9OTF5rt9kpyt2eXsIh0N0oAbpAVtCw1HWo

      at Object.log (__tests__/userpro.test.js:17:9)

  console.log
    🚀 Server is running on port 3030

      at Server.log (server.js:20:11)

  console.log
    Connexion réussie ! Résultat : [ { solution: 2 } ]

      at log (database/client.js:28:13)

  console.log
    🔒 Serveur fermé

      at Object.log (__tests__/userpro.test.js:22:17)

  console.log                                                                                                                                                  
    🔒 Connexion à la BDD fermée                                                                                                                               

      at Object.log (__tests__/userpro.test.js:26:17)

 PASS  __tests__/userpro.test.js
  📌 Test API UserPro                                                                                                                                          
    √ POST /api/userpro/register - devrait inscrire un userpro (183 ms)                                                                                        
    √ GET /api/userpro - devrait retourner tous les userpro (admin) (12 ms)
    √ GET /api/userpro/:id - devrait retourner un userpro par ID (admin) (10 ms)                                                                               
    √ DELETE /api/userpro/40 - devrait supprimer un userpro (admin) (11 ms)                                                                                    
                                                                                                                                                               
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        2.001 s, estimated 3 s
Ran all test suites matching /__tests__\\userpro.test.js/i.


########################################################################################################################