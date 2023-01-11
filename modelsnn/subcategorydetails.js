module.exports = (sequelize,DataTypes) => {
    const SubCategoryDetails = sequelize.define('SubCategoryDetails',{
        SUB_CATEGORY_ID: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        SUB_CATEGORY_NAME: {
          type: DataTypes.STRING(50),
          allowNull: false
        },
        CATEGORY_ID : {
          type: DataTypes.INTEGER,
          allowNull :false,
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