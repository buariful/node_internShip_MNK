
        module.exports = (sequelize, DataTypes) => {
            const sms = sequelize.define('sms', {
                id: {
                  primaryKey: true, autoIncrement:true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    description: 'ID'
                },
                phone: {
                  
                    type: DataTypes.STRING,
                    allowNull: false,
                    description: 'Phone'
                },
                status: {
                  
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    description: 'Status'
                },
            });
            return sms;
        };