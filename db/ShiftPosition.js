module.exports = (sequelize, DataTypes) => {
  const ShiftPosition = sequelize.define('ShiftPosition', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    payment_amnt: { type: DataTypes.NUMERIC, allowNull: false },
    payment_type: { type: DataTypes.STRING, allowNull: false },
    filled: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  ShiftPosition.associate = (models) => {
    ShiftPosition.belongsTo(models.Shift, { unique: false });
    ShiftPosition.belongsTo(models.Position, { unique: false });
    ShiftPosition.belongsTo(models.Werker, {
      through: models.InviteApply,
    });
  };
  return ShiftPosition;
};
