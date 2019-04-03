// const SequelizeMock = require('sequelize-mock');
require('dotenv').config();

jest.setTimeout(30000);

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
  },

  otherWerker: {
    access_token: 'oof',
    refresh_token: 'ow',
    name_first: 'ouch',
    name_last: 'exampleName',
    email: 'me@me.me',
    url_photo: 'image.svg',
    bio: 'biooo',
    phone: '9999999999',
    last_minute: false,
    lat: 40.9,
    long: 40.8,
    address: '12 example st',
    certifications: [
      {
        cert_name: 'hello',
        url_Photo: 'image.jpg',
      },
      {
        cert_name: 'safeserv',
        url_Photo: 'safeserv.bmp',
      },
    ],
    positions: [
      {
        position: 'server',
      },
      {
        position: 'host',
      },
    ],
  },

  Maker: {
    name: 'jonny restaurant',
    url_photo: 'example.com/image',
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
        position: 'host',
        payment_type: 'cash',
        payment_amnt: 5,
      },
    ],
  },

  otherShift: {
    name: 'good',
    start: new Date(),
    end: new Date(),
    lat: 9,
    long: 10,
    address: 'example st',
    description: 'example',
    positions: [
      {
        position: 'server',
        payment_amnt: 6,
        payment_type: 'venmo',
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
  let newWerker;
  let newShift;
  let shiftWithServer;
  let newMaker;
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
    await dbHelpers.models.sequelize.sync({
      force: true,
    });
  });
  describe('Werker', () => {
    describe('addWerker', () => {
      test('should exist', () => {
        expect(dbHelpers.addWerker).toBeDefined();
        expect(dbHelpers.addWerker).toBeInstanceOf(Function);
      });
      test('should create a werker', async () => {
        newWerker = await dbHelpers.addWerker(examples.Werker);
        expect(newWerker).toBeDefined();
        expect(newWerker).toBeInstanceOf(dbHelpers.models.Werker);
      });
      [
        'id',
        'access_token',
        'refresh_token',
        'name_first',
        'name_last',
        'email',
        'url_photo',
        'phone',
      ].forEach(prop => test(`should have property ${prop}`, () => {
        expect(newWerker.get(prop)).toBeDefined();
      }));
      describe('updateWerker', () => {
        let updatedWerker;
        test('should exist', () => {
          expect(dbHelpers.updateWerker).toBeDefined();
          expect(dbHelpers.updateWerker).toBeInstanceOf(Function);
        });
        test('should update a werker', async () => {
          updatedWerker = await dbHelpers.updateWerker(newWerker.id, {
            email: 'hot@mail.com',
            certifications: [
              {
                cert_name: 'safeserv',
                url_Photo: 'fake',
              }, {
                cert_name: 'trash man',
                url_Photo: 'real cert',
              },
            ],
            positions: [
              {
                position: 'dishwasher',
              },
              {
                position: 'server',
              },
            ],
          });
          expect(updatedWerker).toBeDefined();
          expect(updatedWerker).not.toEqual(newWerker);
        });
        test('should change properties', () => {
          expect(newWerker.email).not.toEqual(updatedWerker.email);
        });
        test('should not change properties', () => {
          [
            'name_first',
            'name_last',
            'url_photo',
            'bio',
            'access_token',
            'refresh_token',
            'phone',
            'id',
          ].forEach(prop => expect(updatedWerker[prop]).toEqual(newWerker[prop]));
        });
        describe('should create join table instances', () => {
          describe('certifications', () => {
            let certs;
            let cert;
            let WerkerCertification;
            beforeAll(async () => {
              certs = await updatedWerker.getCertifications({
                joinTableAttributes: ['url_Photo', 'WerkerId', 'CertificationId'],
              });
              console.log(certs);
              [cert] = certs;
              // eslint-disable-next-line prefer-destructuring
              WerkerCertification = cert.WerkerCertification;
            });
            test('should exist', () => {
              expect(cert).toBeInstanceOf(dbHelpers.models.Certification);
            });
            test('should have one element per certification added to the new werker', () => {
              expect(certs.length).toEqual(2);
            });
            test('should have the property cert_name', () => {
              expect(['safeserv', 'trash man']).toContain(cert.get('cert_name'));
            });
            describe('WerkerCertification', () => {
              test('should share WerkerId with Werker', () => {
                expect(WerkerCertification.get('WerkerId')).toEqual(newWerker.get('id'));
              });
              test('should share CertificationId with certification', () => {
                expect(WerkerCertification.get('CertificationId')).toEqual(cert.get('id'));
              });
              test('should have the property url_Photo', () => {
                expect(['fake', 'real cert'])
                  .toContain(WerkerCertification.get('url_Photo'));
              });
            });
          });
          describe('positions', () => {
            let positions;
            let position;
            let WerkerPosition;
            beforeAll(async () => {
              positions = await updatedWerker.getPositions({
                joinTableAttributes: ['WerkerId', 'PositionId'],
              });
              [position] = positions;
              // eslint-disable-next-line prefer-destructuring
              WerkerPosition = positions[0].WerkerPosition;
            });
            test('should exist', () => {
              expect(positions[0]).toBeInstanceOf(dbHelpers.models.Position);
            });
            test('should have two positions', () => {
              expect(positions.length).toEqual(2);
            });
            test('should have attribute position', () => {
              expect(['dishwasher', 'server']).toContain(position.get('position'));
            });
            describe('WerkerPosition', () => {
              test('should share WerkerId with werker', () => {
                expect(WerkerPosition.get('WerkerId')).toEqual(newWerker.get('id'));
              });
              test('should share PositionId with position', () => {
                expect(WerkerPosition.get('PositionId')).toEqual(position.get('id'));
              });
            });
          });
        });
      });
    });
  });
  describe('Shift', () => {
    beforeAll(async () => {
      newMaker = await dbHelpers.models.Maker.create(examples.Maker);
    });
    describe('createShift', () => {
      test('should exist', () => {
        expect(dbHelpers.createShift).toBeDefined();
        expect(dbHelpers.createShift).toBeInstanceOf(Function);
      });
      test('should create a Shift', async () => {
        const shiftTemplate = Object.assign(examples.Shift, { MakerId: newMaker.get('id') });
        newShift = await dbHelpers.createShift(shiftTemplate);
        expect(newShift).toBeInstanceOf(dbHelpers.models.Shift);
      });
      describe('props', () => {
        [
          'id',
          'name',
          'address',
          'lat',
          'long',
          'description',
          'start',
          'end',
        ].forEach(prop => test(`should have property ${prop}`, () => {
          expect(newShift.get(prop)).toBeDefined();
        }));
      });
      describe('ShiftPositions', () => {
        let position;
        let shiftPosition;
        test('should create new Positions', async () => {
          position = await dbHelpers.models.Position.findOne({
            where: {
              position: examples.Shift.positions[0].position,
            },
          });
          expect(position).toBeDefined();
          expect(position).toBeInstanceOf(dbHelpers.models.Position);
        });
        test('should create new ShiftPositions', async () => {
          shiftPosition = await dbHelpers.models.ShiftPosition.findOne({
            where: {
              ShiftId: newShift.id,
            },
          });
          expect(shiftPosition).toBeInstanceOf(dbHelpers.models.ShiftPosition);
        });
        test('should have attribute "filled" with default value false', () => {
          expect(shiftPosition.get('filled')).toBe(false);
        });
        test('should have attributes "payment_type" and "payment_amnt"', () => {
          expect(shiftPosition.get('payment_type')).toBe(examples.Shift.positions[0].payment_type);
          expect(parseInt(shiftPosition.get('payment_amnt'), 10)).toBe(examples.Shift.positions[0].payment_amnt);
        });
      });
    });
    describe('getWerkersForShift', () => {
      let werkers;
      test('should exist', () => {
        expect(dbHelpers.getWerkersForShift).toBeInstanceOf(Function);
      });
      test('should fetch werkers if any can apply to a shift based on positions', async () => {
        shiftWithServer = await dbHelpers.createShift(Object.assign(examples.otherShift, { MakerId: newMaker.get('id') }));
        werkers = await dbHelpers.getWerkersForShift(shiftWithServer.get('id'));
        expect(werkers.length).toBe(1);
      });
      test('should not fetch werkers if none can apply to shift based on positions', async () => {
        werkers = await dbHelpers.getWerkersForShift(newShift.get('id'));
        expect(werkers.length).toBe(0);
      });
    });
    describe('applyOrInviteForShift', () => {
      test('should exist', () => {
        expect(dbHelpers.applyOrInviteForShift).toBeInstanceOf(Function);
      });
      test('should invite a werker to a shift', async () => {
        const invitation = await dbHelpers.applyOrInviteForShift(shiftWithServer.get('id'), newWerker.get('id'), 'server', 'invite');
        console.log(invitation);
        expect(invitation).toBeDefined();
      });
    });
  });
});
