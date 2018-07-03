const models = require('../db/models/index');


const canSeeAllUsers = (user) => {
    return user.role === 'admin';
};

const canUpdateProperty = (user, property) => {
    if( user.role === 'realtor' && property.UserId === user.id)
        return true;
    return user.role === 'admin';

};

const canUpdateUser = (user1, user2) => {
    if(user1.id === user2.id) // can edit himself
        return true;
    return user1.role === 'admin';
};

const canCreateProperty = (user) => {
    return user.role === 'admin' || user.role === 'realtor';
};

const canSeeUserDetails = (user1, user2) => {
    if(user1.id === user2.id) // can edit himself
        return true;
    return user1.role === 'admin';
};

module.exports.canSeeAllUsers = canSeeAllUsers;
module.exports.canUpdateProperty = canUpdateProperty;
module.exports.canUpdateUser = canUpdateUser;
module.exports.canCreateProperty = canCreateProperty;
module.exports.canSeeUserDetails = canSeeUserDetails;
