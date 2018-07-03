'use strict';
const models = require('../models/index');
const _ = require('underscore');
const util = require('util');
const moment = require('moment');
const faker = require('faker');

const randomImages = () => {
    let images = [];
    let length = Math.floor(Math.random() * 5) + 5;
    for (let i = 0; i < length; i++) {
        let x = Math.floor(Math.random() * 100);
        let y = Math.floor(Math.random() * 100);
        images.push(util.format("https://picsum.photos/%s/%s", 500 + x, 500 + y))
    }
    return images;
};

const randomFeatures = () => {
    let features = ['Centrally Air conditioned', 'Club house', 'Pool', 'Snooker', 'Power backup', 'jogging belt',
        'guest parking', 'Lifts', 'Intercom', 'Swimming pool', 'Park', 'Rain water harvesting', 'custom 1',
        'custom 2', 'shopping center', 'Gym', 'Security staff', 'Care taker room'];
    let length = Math.floor(Math.random() * 4) + 4;
    let f = [];
    for (let i = 0; i < length; i++)
        f.push(_.sample(features));
    return features;
};

const randomTitle = () => {
    return _.sample(['3 BHK / Bedroom Apartment / Flat for rent in DLF T',
        '3 BHK / Bedroom Apartment / Flat for rent in DLF T',
        '3 BHK / Bedroom Apartment / Flat for rent in Secto',
        '2 BHK / Bedroom Builder Floor for rent in Cyber Ci',
        '3 BHK / Bedroom Builder Floor for rent in C Block',
        '4 BHK / Bedroom Apartment / Flat for rent in Vipul',
        '4 BHK / Bedroom Apartment / Flat for rent in DLF P',
        '3 BHK / Bedroom Apartment / Flat for rent in Unite',
        '2 BHK / Bedroom Apartment / Flat for rent in Ansal',
        '3 BHK / Bedroom Apartment / Flat for rent in DLF T',
        '3 BHK / Bedroom Builder Floor for rent in DLF City',
        '5 BHK / Bedroom Farm house for rent in Sohna Gurga',
        '4 BHK / Bedroom Apartment / Flat for rent in DLF P',
        '2 BHK / Bedroom Builder Floor for rent in Vipul Wo',
        '3 BHK / Bedroom Apartment / Flat for rent in DLF T',
        '1 BHK / Bedroom Builder Floor for rent in Cyber Ci',
        '3 BHK / Bedroom Apartment / Flat for rent in Dhoot',
        '3 BHK / Bedroom Apartment / Flat for rent in M3M M',
        '3 BHK / Bedroom Apartment / Flat for rent in Dhoot',
        '3 BHK / Bedroom Apartment / Flat for rent in AWHO',
        '18 BHK / Bedroom House / Villa for rent in Sector-',
        '4 BHK / Bedroom Apartment / Flat for rent in Centr',
        '3 BHK / Bedroom Builder Floor for rent in Nirvana',
        '3 BHK / Bedroom Apartment / Flat for rent in BPTP',
        '3 BHK / Bedroom Builder Floor for rent in Sector-4',
        '2 BHK / Bedroom Apartment / Flat for rent in DLF R',
        'Studio Apartment for rent in Dlf 3 Apartment Cyber',
        '4 BHK / Bedroom Apartment / Flat for rent in Alpha',
        '4 BHK / Bedroom Apartment / Flat for rent in Vatik',
        '2 BHK / Bedroom Builder Floor for rent in Saksham',
        '3 BHK / Bedroom Builder Floor for rent in Unitech',
        '4 BHK / Bedroom Apartment / Flat for rent in Ireo',
        '4 BHK / Bedroom Builder Floor for rent in Sector-4',
        'Studio Apartment for rent in South City 2 Gurgaon',
        '1 BHK / Bedroom Builder Floor for rent in Sector-5',
        '3 BHK / Bedroom Apartment / Flat for rent in Emaar',
        '3 BHK / Bedroom Apartment / Flat for rent in Ireo',
        '3 BHK / Bedroom Apartment / Flat for rent in Ireo',
        '4 BHK / Bedroom Apartment / Flat for rent in DLF T',
        '4 BHK / Bedroom Apartment / Flat for rent in Vipul',
        '4 BHK / Bedroom Apartment / Flat for rent in Ireo',
        '3 BHK / Bedroom Apartment / Flat for rent in M3M M',
        '3 BHK / Bedroom Apartment / Flat for rent in DLF N',
        '2 BHK / Bedroom Apartment / Flat for rent in Godre',
        '2 BHK / Bedroom Apartment / Flat for rent in Ireo',
        '4 BHK / Bedroom Apartment / Flat for rent in DLF T',
        '3 BHK / Bedroom Builder Floor for rent in Sector-4',
        '3 BHK / Bedroom Builder Floor for rent in Ansal Fl',
        '5 BHK / Bedroom House / Villa for rent in Unitech',
        '3 BHK / Bedroom Apartment / Flat for rent in Ireo'])
};

const randomDescription = () => {
    return _.sample(['2662 Sq. Ft. - Rent 3 BHK Apartment / Flat in DLF The Crest, Sector-54 Gurgaon * 54 Property & locality photos * Semifurnished * 15th floor (out of 38). View contact number for free. Click for complete details on 99acres.com',
        '2662 Sq. Ft. - Rent 3 BHK Apartment / Flat in DLF The Crest, Sector-54 Gurgaon * 54 Property & locality photos * Semifurnished * 15th floor (out of 38). View contact number for free. Click for complete details on 99acres.com',
        '2301 Sq. Ft. - Rent 3 BHK Apartment / Flat in Sector-67 Gurgaon * 17 Property & locality photos * Furnished * 19th floor (out of 34). View contact number for free. Click for complete details on 99acres.com',
        '1150 Sq. Ft. - Rent 2 BHK Builder floor in Cyber City, DLF CITY PHASE 3, Gurgaon * 14 Property & locality photos * Semifurnished * 1st floor (out of 3). View contact number for free. Click for complete details on 99acres.com',
        '2000 Sq. Ft. - Rent 3 BHK Builder floor in C Block Sushant Lok Phase - I, Gurgaon * Semifurnished * 1st floor (out of 2). View contact number for free. Click for complete details on 99acres.com',
        '2195 Sq. Ft. - Rent 4 BHK Apartment / Flat in Vipul Greens, Sector-48 Gurgaon * 38 Property & locality photos * Semifurnished * 2nd floor (out of 15). View contact number for free. Click for complete details on 99acres.com',
        '2704 Sq. Ft. - Rent 4 BHK Apartment / Flat in DLF Park Place, Sector-54 Gurgaon * 29 Property & locality photos * Semifurnished * 12th floor (out of 30). View contact number for free. Click for complete details on 99acres.com',
        '2699 Sq. Ft. - Rent 3 BHK Apartment / Flat in Unitech Harmony, Nirvana Country, Gurgaon * 60 Property & locality photos * Semifurnished * 5th floor (out of 19). View contact number for free. Click for complete details on 99acres.com',
        '929 Sq. Ft. - Rent 2 BHK Apartment / Flat in Ansal API Valley View Estate, Gwal Pahari, Gurgaon * 1 Property & locality photos * Semifurnished * 6th floor (out of 18). View contact number for free. Click for complete details on 99acres.com',
        '1799 Sq. Ft. - Rent 3 BHK Apartment / Flat in DLF The Primus, Sector-82A Gurgaon * 21 Property & locality photos * Semifurnished * 21st floor (out of 32). View contact number for free. Click for complete details on 99acres.com',
        '3600 Sq. Ft. - Rent 3 BHK Builder floor in DLF City Plots Phase 2, DLF CITY PHASE 2, Gurgaon * 3 Property & locality photos * Furnished * 1st floor (out of 3). View contact number for free. Click for complete details on 99acres.com',
        '7100 Sq. Ft. - Rent 5 BHK Farm house in Sohna, Gurgaon * 1 Property & locality photos. View contact number for free. Click for complete details on 99acres.com',
        '2677 Sq. Ft. - Rent 4 BHK Apartment / Flat in DLF Park Place, Sector-54 Gurgaon * 29 Property & locality photos * Furnished * 18th floor (out of 30). View contact number for free. Click for complete details on 99acres.com',
        '1200 Sq. Ft. - Rent 2 BHK Builder floor in Vipul World Floors, Sector-48 Gurgaon * 18 Property & locality photos * Semifurnished * 2nd floor (out of 2). View contact number for free. Click for complete details on 99acres.com',
        '1799 Sq. Ft. - Rent 3 BHK Apartment / Flat in DLF The Primus, Sector-82A Gurgaon * 29 Property & locality photos * Furnished * 10th floor (out of 32). View contact number for free. Click for complete details on 99acres.com',
        '540 Sq. Ft. - Rent 1 BHK Builder floor in Cyber City, Gurgaon * 5 Property & locality photos * Furnished * 1st floor (out of 5). View contact number for free. Click for complete details on 99acres.com',
        '1480 Sq. Ft. - Rent 3 BHK Apartment / Flat in Dhoot Time Residency, Sector-63 Gurgaon * 30 Property & locality photos * Semifurnished * 9th floor (out of 20). View contact number for free. Click for complete details on 99acres.com',
        '2025 Sq. Ft. - Rent 3 BHK Apartment / Flat in M3M Merlin, Sector-67 Gurgaon * 39 Property & locality photos * Semifurnished * 4th floor (out of 20). View contact number for free. Click for complete details on 99acres.com',
        '1480 Sq. Ft. - Rent 3 BHK Apartment / Flat in Dhoot Time Residency, Sector-63 Gurgaon * 30 Property & locality photos * 6th floor (out of 20). View contact number for free. Click for complete details on 99acres.com',
        '1773 Sq. Ft. - Rent 3 BHK Apartment / Flat in AWHO Sispal Vihar, Sector-49 Gurgaon * 32 Property & locality photos * Semifurnished * 5th floor (out of 13). View contact number for free. Click for complete details on 99acres.com',
        '3150 Sq. Ft. - Rent 18 BHK Independent house / Villa in Sector-52 Gurgaon * Furnished. View contact number for free. Click for complete details on 99acres.com',
        '2450 Sq. Ft. - Rent 4 BHK Apartment / Flat in Central Park, Sector-42 Gurgaon * 44 Property & locality photos * Semifurnished * 7th floor (out of 13). View contact number for free. Click for complete details on 99acres.com',
        '3240 Sq. Ft. - Rent 3 BHK Builder floor in Nirvana Cedar Crest, Nirvana Country, Gurgaon * 21 Property & locality photos * Furnished * 1st floor (out of 3). View contact number for free. Click for complete details on 99acres.com',
        '1090 Sq. Ft. - Rent 3 BHK Apartment / Flat in BPTP Astaire Gardens, Sector-70A Gurgaon * 30 Property & locality photos * Semifurnished * 1st floor (out of 3). View contact number for free. Click for complete details on 99acres.com',
        '3150 Sq. Ft. - Rent 3 BHK Builder floor in Sector-40 Gurgaon * 20 Property & locality photos * Semifurnished * 1st floor (out of 3). View contact number for free. Click for complete details on 99acres.com',
        '1500 Sq. Ft. - Rent 2 BHK Apartment / Flat in DLF Regency Park 1, DLF CITY PHASE 4, Gurgaon * 33 Property & locality photos * Semifurnished * 11th floor (out of 26). View contact number for free. Click for complete details on 99acres.com',
        '1080 Sq. Ft. - Rent Studio Apartment in Dlf 3 Apartment, Cyber City, Gurgaon * 7 Property & locality photos * Furnished * 1st floor (out of 5). View contact number for free. Click for complete details on 99acres.com',
        '3850 Sq. Ft. - Rent 4 BHK Apartment / Flat in Alpha Gurgaon One 22, Sector-22 Gurgaon * 67 Property & locality photos * Semifurnished * 8th floor (out of 9). View contact number for free. Click for complete details on 99acres.com',
        '2933 Sq. Ft. - Rent 4 BHK Apartment / Flat in Vatika City, Sector-49 Gurgaon * 74 Property & locality photos * Furnished * 6th floor (out of 18). View contact number for free. Click for complete details on 99acres.com',
        '1455 Sq. Ft. - Rent 2 BHK Builder floor in Saksham Welfare Association, Sector-22 Gurgaon * 30 Property & locality photos * Semifurnished * 1st floor (out of 2). View contact number for free. Click for complete details on 99acres.com',
        '3240 Sq. Ft. - Rent 3 BHK Builder floor in Unitech Singleton Floors, South City 2, Gurgaon * Semifurnished * 2nd floor (out of 2). View contact number for free. Click for complete details on 99acres.com',
        '3192 Sq. Ft. - Rent 4 BHK Apartment / Flat in Ireo Victory Valley, Sector-67 Gurgaon * 44 Property & locality photos * Furnished * 26th floor (out of 35). View contact number for free. Click for complete details on 99acres.com',
        '4500 Sq. Ft. - Rent 4 BHK Builder floor in Sector-46 Gurgaon * 24 Property & locality photos * Semifurnished * 1st floor (out of 3). View contact number for free. Click for complete details on 99acres.com',
        '430 Sq. Ft. - Rent Studio Apartment in South City 2, Gurgaon * 7 Property & locality photos * Furnished * 2nd floor (out of 5). View contact number for free. Click for complete details on 99acres.com',
        '900 Sq. Ft. - Rent 1 BHK Builder floor in Sector-52 Gurgaon * 14 Property & locality photos * Semifurnished * Ground floor (out of 2). View contact number for free. Click for complete details on 99acres.com',
        '1900 Sq. Ft. - Rent 3 BHK Apartment / Flat in Emaar MGF Palm Drive, Sector-66 Gurgaon * 33 Property & locality photos * Semifurnished * 7th floor (out of 18). View contact number for free. Click for complete details on 99acres.com',
        '2452 Sq. Ft. - Rent 3 BHK Apartment / Flat in Ireo Victory Valley, Sector-67 Gurgaon * 34 Property & locality photos * Semifurnished * 15th floor (out of 39). View contact number for free. Click for complete details on 99acres.com',
        '2677 Sq. Ft. - Rent 3 BHK Apartment / Flat in Ireo Victory Valley, Sector-67 Gurgaon * 34 Property & locality photos * Semifurnished * 15th floor (out of 39). View contact number for free. Click for complete details on 99acres.com',
        '2810 Sq. Ft. - Rent 4 BHK Apartment / Flat in DLF The Icon, DLF CITY PHASE 5, Gurgaon * 19 Property & locality photos * Semifurnished * 8th floor (out of 20). View contact number for free. Click for complete details on 99acres.com',
        '2195 Sq. Ft. - Rent 4 BHK Apartment / Flat in Vipul Greens, Sector-48 Gurgaon * 47 Property & locality photos * Semifurnished * 10th floor (out of 14). View contact number for free. Click for complete details on 99acres.com',
        '3192 Sq. Ft. - Rent 4 BHK Apartment / Flat in Ireo Victory Valley, Sector-67 Gurgaon * 33 Property & locality photos * Semifurnished * 16th floor (out of 40+). View contact number for free. Click for complete details on 99acres.com',
        '2358 Sq. Ft. - Rent 3 BHK Apartment / Flat in M3M Merlin, Sector-67 Gurgaon * 39 Property & locality photos * Semifurnished * 16th floor (out of 30). View contact number for free. Click for complete details on 99acres.com',
        '1936 Sq. Ft. - Rent 3 BHK Apartment / Flat in DLF New Town Heights 1, Sector-90 Gurgaon * 28 Property & locality photos * Semifurnished * 2nd floor (out of 23). View contact number for free. Click for complete details on 99acres.com',
        '1269 Sq. Ft. - Rent 2 BHK Apartment / Flat in Godrej Summit, Sector-104 Gurgaon * 24 Property & locality photos * Unfurnished * 5th floor (out of 19). View contact number for free. Click for complete details on 99acres.com',
        '1435 Sq. Ft. - Rent 2 BHK Apartment / Flat in Ireo Victory Valley, Sector-67 Gurgaon * 32 Property & locality photos * Semifurnished * 24th floor (out of 40+). View contact number for free. Click for complete details on 99acres.com',
        '2810 Sq. Ft. - Rent 4 BHK Apartment / Flat in DLF The Icon, DLF CITY PHASE 5, Gurgaon * 24 Property & locality photos * Semifurnished * 8th floor (out of 20). View contact number for free. Click for complete details on 99acres.com',
        '3078 Sq. Ft. - Rent 3 BHK Builder floor in Sector-46 Gurgaon * 26 Property & locality photos * Furnished * 1st floor (out of 3). View contact number for free. Click for complete details on 99acres.com',
        '1200 Sq. Ft. - Rent 3 BHK Builder floor in Ansal Florence Residency, Sushant Lok Phase - 3, Gurgaon * 27 Property & locality photos * Furnished * 1st floor (out of 2). View contact number for free. Click for complete details on 99acres.com',
        '4320 Sq. Ft. - Rent 5 BHK Independent house / Villa in Unitech Espace, Nirvana Country, Gurgaon * 31 Property & locality photos * Semifurnished. View contact number for free. Click for complete details on 99acres.com',
        '2527 Sq. Ft. - Rent 3 BHK Apartment / Flat in Ireo Victory Valley, Sector-67 Gurgaon * 33 Property & locality photos * Semifurnished * 5th floor (out of 11). View contact number for free. Click for complete details on 99acres.com'])
};


module.exports = {
    up: async (queryInterface, Sequelize) => {

        const users = await models.User.findAll();

        let houses = [];
        for (let i = 0; i < 10000; i++) {
            let data = {
                "title": randomTitle(),
                "description": randomDescription(),
                "rent": Math.random() * 2000 + 1000,
                "maintenance": JSON.stringify({
                    "brokerage": Math.random() * 100,
                    "monthly": Math.random() * 100,
                    "annually": Math.random() * 100,
                }),
                "builtArea": Math.random() * (1000 - 100 + 1) + 100,
                "carpetArea": Math.random() * (1500 - 1000 + 1) + 1000,
                "city": faker.address.city(),
                "locality": faker.address.streetName(),
                "country": faker.address.country(),
                "address": faker.address.streetAddress(),
                "latitude": 28.6289143 + Math.random()*(3)-1,
                "longitude": 77.2065322 + Math.random()*(3)-1,
                "type": _.sample(['1rk', '2rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+']),
                "availability": _.sample(['yes', 'no', 'archive']),
                "availableFor": _.sample(['all', 'family', 'couples', 'bachelors']),
                "availableFrom": moment().add(Math.random()*1000, 'hours').toISOString(),
                "floor": Math.floor(Math.random() * 10),
                "powerBackup": _.sample(['full', 'partial', 'no']),
                "images": JSON.stringify(randomImages()),
                "features": JSON.stringify(randomFeatures()),
                "furnishingStatus": _.sample(['furnished', 'unfurnished', 'semifurnished']),
                "UserId": _.sample(users).id,
                "createdAt": moment().toISOString(),
                "updatedAt": moment().toISOString()

            };
            houses.push(data);
        }

        try {
         return await queryInterface.bulkInsert('Houses', houses, {});
        }catch (e) {
            console.error(e);
        }
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Houses', null, {});

    }
};
