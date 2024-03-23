
        module.exports = (sequelize, DataTypes) => {
            const email = sequelize.define('email', {
                id: {
                  primaryKey: true, autoIncrement:true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    description: 'ID'
                },
                email: {
                  
                    type: DataTypes.STRING,
                    allowNull: false,
                    description: 'Email'
                },
                status: {
                  
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    description: 'Status'
                },
            });
            return email;
        };