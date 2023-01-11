module.exports = (sequelize,DataTypes) => {
    const AmartFields = sequelize.define('AmartFields',{
        FIELD_ID: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        FIELD_NAME: {
          type: DataTypes.STRING(50),
          allowNull: false
        },
        MODULE_ID: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references : {
            model : 'AmartConstants',
            key : 'CONSTANT_ID'
          }
        }
      },{
        timestamps: true,
        createdAt: false,
        updatedAt: false
     }); 
}