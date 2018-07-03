const wrap = require('decorator-wrap').wrap;
const validator = require('validator');
const models = require('../../db/models/index');
const md5 = require('md5');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
const permission = require('../permisson_utility');
const _ = require('underscore');
const ADMIN_UPDATE_ALLOWED_FIELDS = ['role', 'status', 'sex', 'name'];
const SELF_UPDATE_ALLOWED_FIELDS = ['name', 'sex'];
const USER_DETAILS_FIELDS = ['role', 'status', 'sex', 'name', 'email', 'id', 'createdAt', 'updatedAt'];
const config = require('../../config/index');
const Op = models.Sequelize.Op;


const TIME = {
    EMAIL_TOKEN_EXPIRATION: 24 * 60 * 60, // seconds
    PASSWORD_TOKEN_EXPIRATION: 15 * 60  // seconds

};


const createUserInDatabase = async function (userParams) {

    let uuid = uuidv4();
    try {
        let user = await models.User.create({
            email: userParams.email || '',
            name: userParams.name || '',
            emailAttributes: {
                token: uuidv4(),
                created: moment().toISOString(),
                expired: moment().add(TIME.EMAIL_TOKEN_EXPIRATION, 'seconds').toISOString(),
                verified: false
            },
            passwordAttributes: {
                salt: uuid,
                hash: md5(userParams.password + uuid),
            },
            sex: userParams.sex || '',
            status: models.User.rawAttributes.status.defaultValue,
            role: models.User.rawAttributes.role.defaultValue,
        });

        return {
            status: true,
            message: config.MESSAGES.SIGNUP_SUCCESSFUL_MESSAGE,
            args: {
                user: user
            }
        };
    } catch (e) {
        return {
            status: false,
            message: e.errors[0].message
        }
    }
};


const verifyEmail = async function (email, email_token) {
    let user = await models.User.findOne({where: {email: validator.trim(email, '').toLowerCase()}});
    if (!user)
        return {status: false, message: config.MESSAGES.EMAIL_VERIFICATION_FAILED};

    if (user.emailAttributes.token === email_token && moment().toISOString() < user.emailAttributes.expired) {

        user.emailAttributes = Object.assign({}, user.emailAttributes, {
            updated: moment().toISOString(),
            verified: true
        });
        await user.save();

        return {
            status: true,
            message: config.MESSAGES.SUCCESSFUL_EMAIL_VERIFICATION
        };
    }
    return {status: false, message: config.MESSAGES.EMAIL_VERIFICATION_FAILED}
};

const resendEmailConfirmation = async function (email) {
    let user = await models.User.findOne({where: {email: validator.trim(email, '').toLowerCase()}});
    if (!user)
        return {status: false, message: config.MESSAGES.INVALID_EMAIL};
    user.emailAttributes = {
        token: uuidv4(),
        created: moment().toISOString(),
        expired: moment().add(TIME.EMAIL_TOKEN_EXPIRATION, 'seconds').toISOString(),
        verified: false
    };

    await user.save();
    return {
        status: true,
        args: {
            user: user
        },
        message: config.MESSAGES.SUCCESSFULLY_RESEND_CONFIRMATION_MAIL
    }
};

const resetPassword = async function (email, password_token, password) {
    let user = await models.User.findOne({where: {email: validator.trim(email, '').toLowerCase()}});
    if (!user)
        return {status: false, message: config.MESSAGES.INVALID_EMAIL};
    if (validator.trim(password, '').length < config.MESSAGES.PASSWORD_MIN_LENGTH)
        return {status: false, message: config.MESSAGES.INVALID_PASSWORD};

    if (user.passwordAttributes.token === password_token && moment().toISOString() < user.passwordAttributes.expired) {
        let uuid = uuidv4();
        user.passwordAttributes = {
            salt: uuid,
            hash: md5(uuid + password),
            updated: moment().toISOString()
        };
        await user.save();
        return {
            status: true,
            message: config.MESSAGES.SUCCESSFULLY_PASSWORD_RESET,
            args: {
                user: user
            }
        }
    }
    return {status: false, message: config.MESSAGES.PASSWORD_RESET_FAILED}
};

const resendPasswordResetToken = async function (email) {
    let user = await models.User.findOne({where: {email: validator.trim(email, '').toLowerCase()}});
    if (!user)
        return {status: false, message: config.MESSAGES.INVALID_EMAIL};

    user.passwordAttributes = {
        token: (Math.floor(Math.random() * 10000000) + 1000000) + '',
        created: moment().toISOString(),
        expired: moment().add(TIME.PASSWORD_TOKEN_EXPIRATION, 'seconds').toISOString()
    };
    await user.save();
    return {
        status: true,
        args: {
            user: user
        },
        message: config.MESSAGES.SUCCESSFULLY_PASSWORD_TOKEN_SENT
    }

};

const listAllUsers = async (pageNumber, pageLimit) => {
    let users = models.User.findAll({
        limit: pageLimit,
        offset: pageLimit * pageNumber,
        attributes: USER_DETAILS_FIELDS
    });
    return users;
};

const updateUserDetails = async (updater, userArgs, userId) => {
    let user = await models.User.findOne({where: {id: userId}});
    if (!user)
        return {status: false, message: config.MESSAGES.RESOURCE_NOT_FOUND};
    if (permission.canUpdateUser(updater, user)) {
        try {
            let updateVals = {};
            if (updater.id == userId && updater.role != 'admin')  // updating self
                updateVals = _.pick(userArgs, SELF_UPDATE_ALLOWED_FIELDS);
            else
                updateVals = _.pick(userArgs, ADMIN_UPDATE_ALLOWED_FIELDS);

            Object.assign(user, user, updateVals);
            await user.validate({skip: ['email']});
            await user.save();
            return {
                status: true,
                message: 'Permissible Fields are updated'
            }
        } catch (e) {
            return {
                status: false,
                message: e.errors[0].message
            }
        }
    } else {
        return {status: false, message: config.MESSAGES.UNAUTHORIZED_ACCESS}
    }
};

const findUserDetails = async (requester, userid) => {
    let u = await models.User.findOne({
        where: {id: userid},
        attributes: USER_DETAILS_FIELDS
    });
    if (!u)
        return {status: false, message: config.MESSAGES.RESOURCE_NOT_FOUND};
    if (permission.canSeeUserDetails(requester, u)) {
        return {status: true, message: '', args: {user: u}};
    } else {
        return {status: false, message: config.MESSAGES.UNAUTHORIZED_ACCESS}
    }
};

const searchUsers = async (requester, searchParams) => {
    if (permission.canSeeAllUsers(requester)) {
        let query = {};
        let page = searchParams.page || 0;
        USER_DETAILS_FIELDS.forEach((field) => {
            if (searchParams[field]) {
                let x = {};
                x[field] = {
                    [Op.in]: searchParams[field].trim().toLowerCase().split(",")
                };
                query = Object.assign({}, query, x);
            }
        });

        let users = await models.User.findAll({
            limit: config.pageLimit,
            offset: config.pageLimit * page,
            attributes: USER_DETAILS_FIELDS,
            where: query,
            order: [
                ['id', 'DESC']
            ]
        });

        return {status: true, message: '', args: {users: users}};
    } else {
        return {status: false, message: config.MESSAGES.UNAUTHORIZED_ACCESS}
    }
};

module.exports.createUserInDatabase = createUserInDatabase;
module.exports.verifyEmail = verifyEmail;
module.exports.resendEmailConfirmation = resendEmailConfirmation;
module.exports.resetPassword = resetPassword;
module.exports.resendPasswordResetToken = resendPasswordResetToken;
module.exports.listAllUsers = listAllUsers;
module.exports.updateUserDetails = updateUserDetails;
module.exports.findUserDetails = findUserDetails;
module.exports.searchUsers = searchUsers;
