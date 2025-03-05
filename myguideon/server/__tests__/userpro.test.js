const request = require('supertest');
const path = require('node:path');
const { server } = require('../server');
const { pool } = require('../database/client');
const { generateToken } = require('../app/helpers/jwtHelper');

// 🔄 Génération des tokens pour les tests
const tokenAdmin = generateToken({ id: 1, email: 'admin@example.com', role_id: 1 });
const tokenUserPro = generateToken({ id: 2, email: 'testuserpro@example.com', role_id: 2 });
const tokenGuide = generateToken({ id: 2, email: 'guide@example.com', role_id: 2 });
const invalidToken = "Bearer invalid.token.value";
const uniqueEmail = `testuser${Date.now()}@example.com`;

jest.setTimeout(60000);

console.log("🔑 Token Admin :", tokenAdmin);
console.log("🔑 Token UserPro :", tokenUserPro);

afterAll(async () => {
    if (server) {
        await new Promise((resolve) => server.close(resolve));
        console.log('🔒 Serveur fermé');
    }
    if (pool) {
        await pool.end();
        console.log('🔒 Connexion à la BDD fermée');
    }
});
describe('📌 Test API UserPro', () => {
    it('POST /api/userpro/register - devrait inscrire un userpro', async () => {
        const res = await request(server)
            .post('/api/userpro/register')
            .field('name', 'Test User')
            .field('company_name', 'Test Company')
            .field('email',uniqueEmail)
            .field('phone', '0123456789')
            .field('password', 'newpassword')
            .attach('profile_image', path.resolve(__dirname, 'test.jpg')); 
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
    });
    it('GET /api/userpro - devrait retourner tous les userpro (admin)', async () => {
        const res = await request(server)
            .get('/api/userpro')
            .set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('GET /api/userpro/:id - devrait retourner un userpro par ID (admin)', async () => {
        const res = await request(server)
            .get('/api/userpro/40')
            .set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
    });

    it('DELETE /api/userpro/40 - devrait supprimer un userpro (admin)', async () => {
        const res = await request(server)
            .delete('/api/userpro/40')
            .set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain('Utilisateur supprimé avec succès');
    });

    
});
