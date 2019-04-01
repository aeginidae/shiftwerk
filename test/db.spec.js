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
    phone: '5555555555',
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
    phone: '5555555555',
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

describe('Database', () => {
  beforeAll(async () => {
    await Promise.all([
      'Werker',
      'Certification',
      'WerkerCertification',
      'Position',
      'Shift',
      'InviteApply',
      'Maker',
      'Rating',
      'Favorite',
    ].map(model => dbHelpers.models[model].destroy({
      truncate: true,
      cascade: true,
    })));
  });
  describe('Werker', () => {
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
        describe('should create join table instances', () => {
          describe('certifications', () => {
            let certs;
            let cert;
            let WerkerCertification;
            beforeAll(async () => {
              certs = await dbHelpers.models.Certification.findAll({
                include: [
                  {
                    model: dbHelpers.models.Werker,
                    through: {
                      attributes: ['WerkerId', 'url_Photo', 'CertificationId'],
                      where: {
                        WerkerId: newWerker.id,
                      },
                    },
                  },
                ],
              });
              [cert] = certs;
              WerkerCertification = cert.Werkers[0].WerkerCertification.dataValues;
            });
            test('should exist', () => {
              expect(certs).toBeDefined();
            });
            test('should have one element', () => {
              expect(certs.length).toEqual(1);
            });
            test('should have the property cert_name', () => {
              expect(cert.cert_name).toBe(examples.Werker.certifications[0].cert_name);
            });
            describe('WerkerCertification', () => {
              test('should share WerkerId with Werker', () => {
                expect(WerkerCertification.WerkerId).toEqual(newWerker.id);
              });
              test('should share CertificationId with certification', () => {
                expect(WerkerCertification.CertificationId).toEqual(cert.id);
              });
              test('should have the property url_Photo', () => {
                expect(WerkerCertification.url_Photo)
                  .toEqual(examples.Werker.certifications[0].url_Photo);
              });
            });
          });
          describe('positions', () => {
            let positions;
            let position;
            let WerkerPosition;
            beforeAll(async () => {
              positions = await dbHelpers.models.Position.findAll({
                include: [
                  {
                    model: dbHelpers.models.Werker,
                    through: {
                      attributes: ['WerkerId', 'PositionId'],
                      where: {
                        WerkerId: newWerker.id,
                      },
                    },
                  },
                ],
              });
              [position] = positions;
              WerkerPosition = position.Werkers[0].WerkerPosition.dataValues;
            });
            test('should exist', () => {
              expect(positions).toBeDefined();
            });
            test('should have two positions', () => {
              expect(positions.length).toEqual(2);
            });
            test('should have attribute position', () => {
              expect(position.position).toBe('server');
            });
            describe('WerkerPosition', () => {
              test('should share WerkerId with werker', () => {
                expect(WerkerPosition.WerkerId).toEqual(newWerker.id);
              });
              test('should share PositionId with position', () => {
                expect(WerkerPosition.PositionId).toEqual(position.id);
              });
            });
          });
        });
      });
    });
  });
});
