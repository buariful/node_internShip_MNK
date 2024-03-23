
        module.exports = (sequelize, DataTypes) => {
            const location = sequelize.define('location', {
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
                status: {
                  
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    description: 'Status'
                },
            });
            return location;
        };