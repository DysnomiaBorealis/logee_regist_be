// tests/businessController.test.js

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const User = require('../models/userSchema');
const Business = require('../models/businessSchema');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');

let token;
let mongoServer;

describe('Business Controller', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Register and log in a user to get a token
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        token = res.body.token;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        // Clear the Business collection before each test
        await Business.deleteMany({});
    });

    test('Register a new business without verification', async () => {
        const res = await request(app)
            .post('/api/business/register')
            .set('x-auth-token', token)
            .field('companyName', 'My Company')
            .field('companyBank', 'Bank Details')
            .field('companyRegistrationNumber', '123456789')
            .attach('companyDocument', path.resolve(__dirname, 'files', 'sample.pdf'));

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('companyName', 'My Company');
    });

    test('Fail to register business with missing required fields', async () => {
        const res = await request(app)
            .post('/api/business/register')
            .set('x-auth-token', token)
            .field('companyBank', 'Bank Details')
            .field('companyRegistrationNumber', '123456789')
            .attach('companyDocument', path.resolve(__dirname, 'files', 'sample.pdf'));

        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: 'Company Name is required' }),
            ])
        );
    });

    test('Handle file upload errors', async () => {
        const res = await request(app)
            .post('/api/business/register')
            .set('x-auth-token', token)
            .field('companyName', 'My Company')
            .field('companyBank', 'Bank Details')
            .field('companyRegistrationNumber', '123456789')
            .attach('companyDocument', path.resolve(__dirname, 'files', 'large-file.pdf')); // Assume this file exceeds size limit

        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: 'File too large' }),
            ])
        );
    });
});
