module.exports = (sequelize, DataTypes) => {

    
    const User = sequelize.define("User", {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      role: { type: DataTypes.ENUM('admin', 'customer'), defaultValue: 'customer' },
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      verificationCode: DataTypes.STRING
    });
    return User;
  };
  