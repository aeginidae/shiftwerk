const sequelize = require('sequelize');
const db = require('../db/index');
/**
 * Function used to create a new shift
 * @param {string} name - the name of the shift
 * @param {date} time_date - the time and date of the shift
 * @param {numbr} duration - the duration of the shift
 * @param {string} address - the address of the shift
 * @param {number} lat - the latitude of the shift
 * @param {number} long - the longitude of the shift
 * @param {number} payment_amnt - the amount of money the shift is paying
 * @param {string} description - a short description of the shift
 * @param {number} cache_rating - a chached rating
 */
const createShift = (name, time_date, duration, address, lat, long, payment_amnt, description, cache_rating) => {
  return db.models.Shift.create({
    name, time_date, duration, address, lat, long, payment_amnt, description, cache_rating,
  });
};

/**
 * Function used to apply for a shift - updates the shift status to 'Pending'
 * @param {number} shiftId - the id of the shift to be applied to
 * @param {number} werkerId - the of the werker applying to the shift
 */
const applyForShift = (shiftId, werkerId) => {
  return db.models.InviteApply.update({
    status: 'Pending',
    where: {
      shiftId,
      werkerId,
    },
  });
};

/**
 * Function used to accept shifts - updates the shift status to 'Accepted'
 * @param {number} shiftId - the id of the shift to be accepted
 * @param {number} werkerId - the id of the werker accepting the shift
 */
const acceptShift = (shiftId, werkerId) => {
  return db.models.InviteApply.update({
    status: 'Accepted',
  }, {
    where: {
      shiftId,
      werkerId,
    },
  });
};

/**
 * Function to decline shifts - updates the shift status to 'Declined'
 * @param {number} shiftId - the id of shift to be declined
 * @param {number} werkerId - the id of the werker declining the shift
 */
// function to decline shifts
const declineShift = (shiftId, werkerId) => {
  return db.models.InviteApply.update({
    status: 'Declined',
  }, {
    where: {
      shiftId,
      werkerId,
    },
  });
};

/**
 * Function to search for shifts by keywords
 * @param {object} data - an object with search terms
 */
const getShiftsBySearchTermsAndVals = (data) => {
  return db.models.ShiftPosition.find({
    where: { id: data.PositionId, payment_amnt: data.payment_amnt },
    include: [db.models.Shift, db.models.Position],
  });
};

/**
 * Function to search for werkers by position
 * @param {object} data - an object with search terms
 */
const getWerkersByTerm = (data) => {
  return db.models.Werker.find({
    where: { id: data.PositionId },
    include: [db.models.Position],
  });
};

/**
 * Function to invite a werker to a shift - creates a new invitation
 * @param {number} shiftId - the id of the shift that the werker will be invited to
 * @param {object} data - the data needed to create the new invitation
 */
const inviteWerker = (shiftId, data) => {
  return db.models.InviteApply.create({
    idWerker: data.idWerker, idShift: shiftId, idPosition: data.idPosition, status: data.status, expiration: data.expiration, type: data.type,
  });
};

/**
 * Function to get a user profile
 * @param {object} data - object containing the user's id
 */
const getProfile = (data) => {
  return db.models.Werker.findOne({
    where: {
      id: data.id,
    },
  });
};

/**
 * Function to get a shift by it's id
 * @param {number} shiftId - id of the shift to be found
 */
const getShiftsById = (shiftId) => {
  return db.models.Shift.findOne({
    where: {
      id: shiftId,
    },
  });
};

module.exports = {
  getProfile,
  inviteWerker,
  getWerkersByTerm,
  getShiftsBySearchTermsAndVals,
  declineShift,
  acceptShift,
  createShift,
  applyForShift,
  getShiftsById,
};
