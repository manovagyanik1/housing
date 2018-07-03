process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = require('chai').assert;
const should = chai.should();
const userFactory = require('../db/factories/user');
const truncate = require('../db/truncate');
const userHelper = require('../../utilities/helpers/user_helper');
const moment = require('moment');
const models = require('../../db/models/index');
const md5 = require('md5');
const sinon = require('sinon');
const controllerMiddleware = require('../../utilities/controller_middlewares');
let server = null;


chai.use(chaiHttp);

describe('Users', async () => {
    let defaultUser = {
        email: 'jonasdick@gmail.com',
        name: 'Jon dick',
        password: 'test1234',
        sex: 'male',
        role: 'consumer',
        status: 'active'
    };
    let user = null;


    beforeEach(async () => {

        await truncate();
        user = await userFactory({
            emailAttributes: { verified: true},
            passwordAttributes: {salt: '1234', hash: md5('1234'+ '1234')},
            role: 'admin'
        });
        sinon.stub(controllerMiddleware, 'isAuthenticated').callsFake((req, res, next) => {
            req.session.user = user;
            return next();
        });
        server = require('../../app');
    });

    afterEach(async () =>{
        controllerMiddleware.isAuthenticated.restore();
    });

    describe('/:id PUT update user details', async ()=>{
        it('should update user details', async () => {
            let u =  await userFactory();
            let res = await chai.request(server)
                .put('/api/v1/user/'+user.id)
                .send({sex:'other'});
            res.should.have.status(200);
        });
    })

});