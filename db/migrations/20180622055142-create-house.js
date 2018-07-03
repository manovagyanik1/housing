'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Houses', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING,
                allowNull:false

            },
            description: {
                type: Sequelize.STRING(1024),
                allowNull: false
            },

            // rentants related
            rent:{
                type:Sequelize.DOUBLE,
                allowNull: false
            },
            maintenance:{   // monthly, deposit, brokerage, annually
                type:Sequelize.JSONB,
                defaultValue: {}
            },

            // size related
            builtArea:{
                type: Sequelize.DOUBLE,
                allowNull:false
            },
            carpetArea:{
                type: Sequelize.DOUBLE,
                allowNull: false
            },

            // address and location related
            city:{
                type: Sequelize.STRING,
                allowNull: false
            },
            locality:{
                type: Sequelize.STRING,
                allowNull: false
            },
            country:{
                type: Sequelize.STRING,
                allowNull: false
            },
            address:{
                type:Sequelize.STRING,
                allowNull: false
            },
            latitude:{
                type:Sequelize.DOUBLE,
                defaultValue:0
            },
            longitude:{
                type:Sequelize.DOUBLE,
                defaultValue:0
            },

            // type and availiblity
            type:{
                type:Sequelize.ENUM('1rk', '2rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+')
            },
            availability:{
                type:Sequelize.ENUM('yes', 'no', 'archive'),
                defaultValue: 'archive'
            },
            availableFor:{
                type: Sequelize.ENUM('all', 'family', 'couples', 'bachelors'),
                defaultValue: 'all'
            },
            availableFrom: {
                type:Sequelize.DATE,
                allowNull: false
            },


            floor:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            powerBackup:{
                type: Sequelize.ENUM('full', 'partial', 'no'),
                defaultValue: 'no'
            },
            features: {
                type: Sequelize.JSONB, // air conditioned
                defaultValue: []
            },


            tags:{  // array of string
                type: Sequelize.JSONB,
                defaultValue: []
            },

            images:{   // array of urls
                type: Sequelize.JSONB,
                defaultValue: []
            },

            furnishingStatus:{
                type:Sequelize.ENUM('furnished', 'unfurnished', 'semifurnished')
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
        }).then( async () =>{
            await queryInterface.addIndex('Houses', ['rent'], {name: 'Houses_rent_index'});
            await queryInterface.addIndex('Houses', ['builtArea'], {name: 'Houses_builtArea_index'});
            await queryInterface.addIndex('Houses', ['carpetArea'], {name: 'Houses_carpetArea_index'});
            await queryInterface.addIndex('Houses', ['availability'], {name: 'Houses_availability_index'});
            await queryInterface.addIndex('Houses', ['availableFor'], {name: 'Houses_availableFor_index'});
            await queryInterface.addIndex('Houses', ['powerBackup'], {name: 'Houses_powerBackup_index'});
            await queryInterface.addIndex('Houses', ['furnishingStatus'], {name: 'Houses_furnishingStatus_index'});
            await queryInterface.addIndex('Houses', ['UserId'], {name: 'Houses_UserId_index'});
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Houses').then( async () =>{
            await queryInterface.removeIndex('Houses', 'Houses_rent_index' );
            await queryInterface.removeIndex('Houses', 'Houses_builtArea_index' );
            await queryInterface.removeIndex('Houses', 'Houses_carpetArea_index' );
            await queryInterface.removeIndex('Houses', 'Houses_availability_index' );
            await queryInterface.removeIndex('Houses', 'Houses_availableFor_index' );
            await queryInterface.removeIndex('Houses', 'Houses_powerBackup_index' );
            await queryInterface.removeIndex('Houses', 'Houses_furnishingStatus_index' );
            await queryInterface.removeIndex('Houses', 'Houses_UserId_index' );
        });
    }
};