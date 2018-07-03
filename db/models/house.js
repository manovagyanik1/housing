'use strict';
const sequelizeTransforms = require('sequelize-transforms');
const validator = require('validator');
const config = require('../../config/index');
const util = require('util');

Array.prototype.isArray = true;

module.exports = (DataType, Sequelize) => {
    const House = DataType.define('House', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING,
            allowNull:false,
            trim: true,
            validate:{
                len:{
                    args: [10, 50],
                    msg: 'Title should be in range 10 to 50 words'
                }
            }

        },
        description: {
            type: Sequelize.STRING(1024),
            allowNull: false,
            trim: true,
            validate:{
                len:{
                    args: [50, 1000],
                    msg: 'Description should be in range 50 to 1000 words'
                }
            }
        },

        // rentants related
        rent:{
            type:Sequelize.DOUBLE,
            allowNull: false,
            toDouble: true,
            validate: {
                min:{
                    args: [500],
                    msg: 'Minimum rent should be 500'
                },
                max:{
                    args: [10000],
                    msg: 'Maximum rent should be 10000'
                }
            }

        },
        maintenance:{   // monthly, deposit, brokerage, annually only
            type:Sequelize.JSONB,
            defaultValue: {},
            validate:{
                isValidJson: (val ,next) =>{
                    if(val && !(typeof val === 'object'))
                        next('Maintenance needs nested fields of '+ config.maintenance);
                    for( let k in val){
                        if(config.maintenance.includes(k)){
                            if((!Number(val[k]) || Number(val[k]) < 0))
                                next('Maintenance: '+k+' should be greater than 0')
                        }else{
                            next('Only '+config.maintenance+'  are required in maintenance');
                        }
                    }
                    next();
                }
            }
        },

        // size related
        builtArea:{
            type: Sequelize.DOUBLE,
            allowNull:false,
            toDouble:true,
            validate:{
                min:{
                    args:[250],
                    msg: 'Built area cant be less than 250'
                },max:{
                    args: [10000],
                    msg: 'Maximum builtArea should be 10000'
                }
            }
        },
        carpetArea:{
            type: Sequelize.DOUBLE,
            allowNull: false,
            toDouble: true,
            validate:{
                min:{
                    args:[250],
                    msg: 'Carpet area cannot be less than 250'
                },
                max:{
                    args: [10000],
                    msg: 'Maximum carpetArea should be 10000'
                },
                isLessThanBuilt: (val , next) => {
                    if(!Number(val) || Number(val) > this.carpetArea)
                        next('Carpet Area cannot be greater than built area')
                    else
                        next();
                }
            }
        },

        // address and location related
        city:{
            type: Sequelize.STRING,
            allowNull: false,
            trim: true,
            validate:{
                len: {
                    args: [2,30],
                    msg: "City length should be in range of 2 to 30"
                }
            }
        },
        locality:{
            type: Sequelize.STRING,
            allowNull: false,
            trim: true,
            validate:{
                len: {
                    args: [2,30],
                    msg: "Locality length should be in range of 2 to 30"
                }
            }
        },
        country:{
            type: Sequelize.STRING,
            allowNull: false,
            trim: true,
            validate:{
                len: {
                    args: [2,30],
                    msg: "Country length should be in range of 2 to 30"
                }
            }
        },
        address:{
            type:Sequelize.STRING,
            allowNull: false,
            trim: true,
            validate:{
                len: {
                    args: [10,150],
                    msg: "Address length should be in range of 10 to 150"
                }
            }
        },
        latitude:{
            type:Sequelize.DOUBLE,
            defaultValue:0,
            toDouble: true,
            validate: {
                min:{
                    args: [-90],
                    msg: 'Minimum latitude should be -90'
                },
                max:{
                    args: [90],
                    msg: 'Maximum latitude should be 90'
                }
            }

        },
        longitude:{
            type:Sequelize.DOUBLE,
            defaultValue:0,
            toDouble: true,
            validate: {
                min:{
                    args: [-180],
                    msg: 'Minimum longitude should be -180'
                },
                max:{
                    args: [180],
                    msg: 'Maximum longitude should be 180'
                }
            }
        },

        // type and availiblity
        type:{
            type:Sequelize.ENUM('1rk', '2rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+'),
            trim: true,
            validate:{
                isValidField: (val, next)=>{
                    if(!House.rawAttributes.type.values.includes(val))
                        return next('Type should be only '+House.rawAttributes.type.values );
                    else next();
                }
            }
        },
        availability:{
            type:Sequelize.ENUM('yes', 'no', 'archive'),
            defaultValue: 'archive',
            trim: true,
            validate:{
                isValidField: (val, next)=>{
                    if(!House.rawAttributes.availability.values.includes(val))
                        return next('Availability should be only '+House.rawAttributes.availability.values );
                    else next();
                }
            }
        },
        availableFor:{
            type: Sequelize.ENUM('all', 'family', 'couples', 'bachelors'),
            defaultValue: 'all',
            trim: true,
            validate:{
                isValidField: (val, next)=>{
                    if(!House.rawAttributes.availableFor.values.includes(val))
                        return next('Available For should be only '+House.rawAttributes.availableFor.values );
                    else next();
                }
            }

        },
        availableFrom: {
            type:Sequelize.DATE,
            allowNull: false
        },


        floor:{
            type:Sequelize.INTEGER,
            allowNull:false,
            toDouble: true,
            validate: {
                min:{
                    args: [0],
                    msg: 'Minimum floor should be Zero'
                },
                max:{
                    args: [150],
                    msg: 'Maximum floor should be 150'
                }
            }
        },

        powerBackup:{
            type: Sequelize.ENUM('full', 'partial', 'no'),
            defaultValue: 'no',
            trim: true,
            validate:{
                isValidField: (val, next)=>{
                    if(!House.rawAttributes.powerBackup.values.includes(val))
                        return next('Power Backup For should be only '+House.rawAttributes.powerBackup.values );
                    else next();
                }
            }
        },
        features: {  // [ 'closed parking', 'centraly air conditioned', '24 hour security' ]
            type: Sequelize.JSONB, // air conditioned
            defaultValue: [],
            validate:{
                isValidField: (val , next) => {
                    if(val && !val.isArray)
                        next('Invalid value in Features, expect array of strings');
                    if(val.length > 25)
                        next('Features cannot be more than 25');
                    val.forEach((item) => {
                        if(!item.trim())
                            next('Empty values not valid in features');
                    });
                    next();
                }

            }
        },


        tags:{  // array of string optional , good for search
            type: Sequelize.JSONB,
            defaultValue: [],
            validate:{
                isValidField: (val , next) => {
                    if(val && !val.isArray)
                        next('Invalid value in Tags, expect array of strings');
                    if(val.length > 25)
                        next('Features cannot be more than 25');
                    val.forEach((item) => {
                        if(!item.trim())
                            next('Empty values not valid in features');
                    });
                    next();
                }
            }
        },

        images:{   // array of urls
            type: Sequelize.JSONB,
            defaultValue: [],
            validate:{
                isValidField: (val, next) => {
                    if(val && !val.isArray)
                        next('Invalid value in Images, expect array of urls');
                    if(!val || val.length <= 0)
                        next('At least one image is required');
                    for(let i = 0 ; i < val.length; i++){
                        if(!(validator.isURL(val[i]) || validator.isURL(val[i].replace('localhost:3000', 'localhost.com'))))
                            next('Images does not contain valid urls')
                    }
                    next();
                }
            }
        },

        furnishingStatus:{
            type:Sequelize.ENUM('furnished', 'unfurnished', 'semifurnished'),
            trim: true,
            validate:{
                isValidField: (val, next)=>{
                    if(!House.rawAttributes.furnishingStatus.values.includes(val))
                        return next('Furnishing Status should be only '+House.rawAttributes.furnishingStatus.values );
                    else next();
                }
            }
        },

        UserId:{
            type: Sequelize.INTEGER,
            references:{
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },

        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }

    });

    House.associate = function (models) {
        // associations can be defined here
        House.belongsTo(models.User)
    };

    sequelizeTransforms(House, {
        toDouble: (val, def) =>{
            return Number(val);
        }
    });
    return House;
};