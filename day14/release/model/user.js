
        module.exports = (sequelize, DataTypes) => {
            const user = sequelize.define('user', {
                id: {
                  primaryKey: true, autoIncrement:true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    description: 'ID'
                },
                name: {
                  
                    type: DataTypes.STRING,
                    allowNull: false,
                    description: 'Name'
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
            return user;
        };