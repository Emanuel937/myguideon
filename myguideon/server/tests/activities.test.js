const request = require('supertest');
const { app, server } = require('../server');  // Importe `server` aussi

const { pool } = require('../database/client');  // Importe `pool` aussi

describe('📌 Test API Activities', () => {

    it('GET /api/activities - devrait retourner toutes les activités', async () => {
        const res = await request(app).get('/api/activities');
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('GET /api/activities/:id - devrait retourner une activité', async () => {
        const res = await request(app).get('/api/activities/22');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
    });

    it('POST /api/activities - devrait ajouter une nouvelle activité', async () => {
        const res = await request(app)
            .post('/api/activities')
            .send({
                name: "Test Activity",
                description: "Test Description",
                price: 50,
                currency: "USD",
                imageCover: "/images/test.jpg",
                location: "Test Location",
                language: "English",
                created_by: 1
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('activity.id');
    });

    it('PUT /api/activities/:id - devrait mettre à jour une activité', async () => {
        const res = await request(app)
            .put('/api/activities/22')
            .send({
                name: "Updated Activity",
                description: "Updated Description",     // 🚨 Ajoute `description` obligatoire
                price: 120,
                currency: "USD",
                imageCover: "/images/updated.jpg",
                location: "Updated Location",
                language: "English",
                duration: "2h",
                max_participants: 10,
                availability: "2025-03-05 10:00:00",
                age_limit: 18,
                category: "Aventure",
                status: "Published",
                created_by: 1,
                image_cover_id: 1
            });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Activité mise à jour avec succès');
    });

    it('DELETE /api/activities/:id - devrait supprimer une activité', async () => {
        const res = await request(app).delete('/api/activities/22');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Activité supprimée avec succès.');
    });

});
afterAll(async () => {
    server.close();          // 🚨 Ferme le serveur
    await pool.end();        // 🚨 Ferme la connexion MySQL proprement
});
