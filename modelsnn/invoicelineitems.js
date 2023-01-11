module.exports = (sequelize,DataTypes) => {
    const InvoiceLineItems = sequelize.define('InvoiceLineItems',{
        INVOICE_LINE_ITEM_ID: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        PRODUCT_ID: {
          type: DataTypes.INTEGER,
          allowNull :false,
          references : {
            model : 'ProductDetails',
            key : 'PRODUCT_ID'
          }
        },
        QUANTITY: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        ITEM_PRICE: {
          type: DataTypes.REAL,
          allowNull: false
        },
        TOTAL_PRICE: {
          type: DataTypes.REAL,
          allowNull :false,
        },
        INVOICE_ID: {
          type: DataTypes.INTEGER,
          allowNull :false,
          references : {
            model : 'Invoices',
            key : 'INVOICE_ID'
          }
        },
      },{
        timestamps: true,
        createdAt: 'ADDED_TIME',
        updatedAt: false
     }); 
}