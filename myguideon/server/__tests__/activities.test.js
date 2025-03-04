const request = require('supertest');
const {server} = require('../server');  // 🚨 Importer server et non app !
const { pool } = require('../database/client');
const path = require('node:path');

afterAll(async () => {
    server.close();          // 🚨 Ferme le serveur proprement
    await pool.end();        // 🚨 Ferme la connexion MySQL proprement    
});
it('POST /api/activities - devrait ajouter...', async () => {}, 30000); 
it('PUT /api/activities/:id - devrait mettre à jour...', async () => {}, 30000);

describe('📌 Test API Activities', () => {
    it('GET /api/activities - devrait retourner toutes les activités', async () => {
        const res = await request(server).get('/api/activities');  // 🚨 Utiliser server et non app
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0]).toHaveProperty('images'); // Vérifier que `images` existe
    });

    it('GET /api/activities/:id - devrait retourner une activité avec ses images', async () => {
        const res = await request(server).get('/api/activities/25');  // 🚨 Utiliser server et non app
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('images');
    });

    it('POST /api/activities - devrait ajouter une nouvelle activité avec images', async () => {
        const res = await request(server)
            .post('/api/activities')
            .field('name', 'Test Activity')
            .field('description', 'Test Description')
            .field('price', 100)
            .field('currency', 'USD')  
            .field('location', 'Paris') 
            .field('language', 'English') 
            .field('latitude', 48.8566)   
            .field('longitude', 2.3522)   
            .field('duration', 120)       
            .field('max_participants', 20) 
            .field('category', 'Aventure') 
            .field('status', 'Published')  
            .field('created_by', 1)        
            .attach('imageCover', path.resolve('__tests__/assets/test-image.jpg'));
    
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Test Activity');
    });

    it('PUT /api/activities/:id - devrait mettre à jour une activité avec images', async () => {
        const res = await request(server)
            .put('/api/activities/25')
            .field('name', 'Updated Activity')
            .field('description', 'Updated Description')
            .field('price', 150)  
            .field('currency', 'USD')
            .field('location', 'Paris')
            .field('language', 'English')
            .field('latitude', 48.8566)
            .field('longitude', 2.3522)
            .field('duration', 120)
            .field('max_participants', 20)
            .field('category', 'Aventure')
            .field('status', 'Published')
            .field('created_by', 1)
            .attach('imageCover', path.resolve('__tests__/assets/test-image.jpg'));
    
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("mise à jour");
    });
    
    

    it('DELETE /api/activities/:id - devrait supprimer une activité', async () => {
        const res = await request(server).delete('/api/activities/25');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Activité supprimée avec succès.');
    });
});
