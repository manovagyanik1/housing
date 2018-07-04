const genUtil = require( "../utilities/genutils/index" );
const models = require( "../db/models/index" );

const isAuthenticated = async ( req, res, next ) => {
    let session = req.session;

    if ( session.user ) {
        req.session.user = await models.User.findOne({where: {id: session.user.id}});
        return next();
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
