// const SequelizeMock = require('sequelize-mock');
require('dotenv').config();

process.env.DBNAME = 'test';
const dbHelpers = require('../dbHelpers/dbHelpers');


const examples = {
  Werker: {
    access_token: 'loginplease',
    refresh_token: 'notexpired',
    name_first: 'user',
    name_last: 'mcExample',
    email: 'example@example.com',
    url_photo: 'example.com/image',
    bio: 'example bio',
    phone: 5555555555,
    last_minute: true,
    lat: 40.1,
    long: 40.2,
    address: '1111 St. Charles Avenue, New Orleans, LA 70115',
    certifications: [
      {
        cert_name: 'hello',
        url_Photo: 'image.jpg',
      },
    ],
    positions: [
      {
        position: 'server',
      },
      {
        position: 'bartender',
      },
    ],
  },

  Maker: {
    name: 'jonny restaurant',
    urlPhoto: 'example.com/image',
    phone: 5555555555,
    email: 'example@example.com',
    bio: 'example bio',
  },

  Shift: {
    name: 'catering example',
    start: new Date(),
    end: new Date(),
    address: '1234 example st',
    lat: 40.2,
    long: 40.1,
    description: 'example event',
    positions: [
      {
        position: 'server',
        payment_type: 'cash',
        payment_amnt: 5,
      },
    ],
  },

  Certification: {
    certName: 'safeserv',
  },

  Position: {
    position: 'example',
  },
};

describe('Werker', () => {
  beforeAll(async () => {
    await dbHelpers.models.Werker.destroy({
      truncate: true,
      cascade: true,
    });
  });
  // let werker;

  // describe('props', () => {
  //   Object.keys(examples.Werker).forEach((prop) => {
  //     test(`should have property ${prop}`, async () => {
  //       expect(werker).toHaveProperty(prop, examples.Werker[prop]);
  //     });
  //   });
  // });

  describe('helpers', () => {
    describe('addWerker', () => {
      let newWerker;
      test('should create a werker', async () => {
        const { dataValues } = await dbHelpers.addWerker(examples.Werker);
        newWerker = dataValues;
        expect(newWerker).toBeDefined();
      });
      [
        'id',
        'access_token',
        'refresh_token',
        'name_first',
        'name_last',
        'email',
        'url_photo',
        'bio',
        'phone',
        'last_minute',
        'lat',
        'long',
        'address',
        'cache_rating',
        'createdAt',
        'updatedAt',
      ].forEach(prop => test(`should have property ${prop}`, () => {
        expect(newWerker[prop]).toBeDefined();
      }));
    });
  });
});
