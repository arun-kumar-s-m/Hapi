module.exports = (sequelize,DataTypes) => {
    const AuditLogs = sequelize.define('AuditLogs',{
        AUDIT_LOG_ID: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        USER_ID: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references : {
            model : 'UserDetails',
            key : 'USER_ID'
          }
        },
        MODULE_ID: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references : {
            model : 'AmartConstants',
            key : 'CONSTANT_ID'
          }
        },
        ACTIONS : {
          type : DataTypes.STRING(50),
          allowNull : false
        },
        FIELDS_AFFECTED : {
          type : DataTypes.JSON,
          allowNull : false
        },
      },{
        timestamps: true,
        createdAt: 'AUDITED_TIME',
        updatedAt: false
     }); 
}