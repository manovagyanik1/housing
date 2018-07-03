process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = require('chai').assert;
const should = chai.should();
const truncate = require('../db/truncate');
const moment = require('moment');
const faker = require('faker');
const houseFactory = require('../db/factories/house');
const userFactory = require('../db/factories/user');
const md5 = require('md5');
const sinon = require('sinon');
const controllerMiddleware = require('../../utilities/controller_middlewares');
const models = require('../../db/models/index');
let server = null;

chai.use(chaiHttp);


describe('House', async () => {

    let defaultHouseParams = {
        title: faker.name.firstName() + faker.name.lastName(),
        description: "This is just a test desription that will check what is valid description here around",
        rent: faker.random.number(),
        maintenance:{
            monthly:10,
            brokerage: 100,
            deposit: 2500
        },
        builtArea: faker.random.number() + 250,
        carpetArea: faker.random.number() + 250,
        city: faker.address.city(),
        locality: faker.address.streetName(),
        country: faker.address.country().split(' ')[0],
        address: faker.address.streetName() + " " + faker.address.city,
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
        type: '2bhk',
        availability: 'yes',
        availableFor: 'all',
        availableFrom: moment().toISOString(),
        floor: 2,
        powerBackup: 'full',
        features: ['Cover car parking', 'Centrally air conditioned', '24 hours security'],
        tags: [faker.random.arrayElement(), faker.random.arrayElement(), faker.random.arrayElement()],
        images: [faker.image.imageUrl(), faker.image.imageUrl(), faker.image.imageUrl()],
        furnishingStatus: 'furnished',
    };
    let user = null;

    beforeEach(async () => {
        await truncate();
        user = await userFactory({
            emailAttributes: { verified: true},
            passwordAttributes: {salt: '1234', hash: md5('1234'+ '1234')},
            role: 'admin'
        });
        sinon.stub(controllerMiddleware, 'isAuthenticated').callsFake(async (req, res, next) => {
            req.session.user = user;
            return next();
        });
        server = require('../../app');

    });

    afterEach(async () =>{
        controllerMiddleware.isAuthenticated.restore();
    });

    describe('/search POST Search Houses', async () => {

        it('it should return all available property user successful', async () => {
            await houseFactory();
            await houseFactory();
            let res = await chai.request(server)
                .post('/api/v1/house/search')
                .send({});
            res.should.have.status(200);
            assert(res.body.success.data.length === 2);
        });
        it('it should return no property', async () => {
            let res = await chai.request(server)
                .post('/api/v1/house/search');
            res.should.have.status(200);
            assert(res.body.success.data.length === 0);
        });
        it('should search based on custom params', async () => {
            let res = await chai.request(server)
                .post('/api/v1/house/search')
                .send({
                    rent:[1,10000],
                    floor: [1, 10]
                });
            res.should.have.status(200);
        });
    });

    describe('/ POST House', async () => {
        it('should create house with successfull parameters', async() => {
            let res = await chai.request(server).post('/api/v1/house').send(defaultHouseParams);
            res.should.have.status(201);
            if(res.body.error)
                console.log(res.body.error.message);

        });

        it('should report error for no images', async () => {
            let res = await chai.request(server).post('/api/v1/house').send(Object.assign({}, defaultHouseParams, {images:[]}));
            res.should.have.status(400);
            expect(res.body.error.message.includes('Images'));
        });

        it('should report error on invaid features', async () => {
            let params = Object.assign({}, defaultHouseParams, {features: ['  ']});
            let res = await chai.request(server).post('/api/v1/house').send(params);
            res.should.have.status(400);
            expect(res.body.error.message.includes('Amenity'));
        });

        it('should report invalid type of data', async () => {
            let res = await chai.request(server).post('/api/v1/house').send(Object.assign({}, defaultHouseParams, {images:{}}));
            res.should.have.status(400);
            expect(res.body.error.message.includes('Invalid value in Images'));
        });
    });

    describe('/:id DELETE', async () => {
        it('should delete the record successfully', async () => {
            let h = await houseFactory();
            let res = await chai.request(server)
                .delete('/api/v1/house/'+h.id);
            res.should.have.status(200);
            expect( (await models.House.findOne({where:{id: h.id}})) == null)
        });

        it('should not delete the record successfully', async () => {
            let h = await houseFactory();
            let res = await chai.request(server)
                .delete('/api/v1/house/'+(h.id +1));
            res.should.have.status(400);
            expect( (await models.House.findOne({where:{id: h.id}})) != null)
        });
    });

    describe('/:id PUT', async () => {
        it('should update the record successfully', async () => {
            let h = await houseFactory();
            let res = await chai.request(server)
                .put('/api/v1/house/'+h.id)
                .send({rent:1001});
            res.should.have.status(200);
            let h2 = await models.House.findOne({where:{id: h.id}})
            expect(h2.rent === 1001)

        });

        it('should not delete the record successfully', async () => {
            let h = await houseFactory();
            let res = await chai.request(server)
                .put('/api/v1/house/'+(h.id +1));
            res.should.have.status(400);
            expect( (await models.House.findOne({where:{id: h.id}})).rent === h.rent)
        });
    });




});