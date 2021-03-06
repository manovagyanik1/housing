const genUtil = require( "../utilities/genutils/index" );
const models = require( "../db/models/index" );

const isAuthenticated = async ( req, res, next ) => {
    let session = req.session;

    if ( session.user ) {
        let user = await models.User.findOne({where: {id: session.user.id}});
        if (user && user.status == 'active'){
            req.session.user = user
            return next();
        }else{
            genUtil.sendJsonResponse(res, 401, "Unauthorized access");
        }
    }else {

        // let u = await models.User.findOne( { "where": {
        //     "email": "manovagyanik1@gmail.com"
        // } } );
        //
        // req.session.user = u;
        // return next();


        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        genUtil.sendJsonResponse(res, 401, "Unauthorized access", null);
    }
};


module.exports.isAuthenticated = isAuthenticated;
