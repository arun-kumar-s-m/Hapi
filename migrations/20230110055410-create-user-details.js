'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_details', {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING(30)
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique : true
      },
      username: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique : true
      },
      password: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique : true
      },
      // primary_address : {
      //   type: Sequelize.INTEGER,
      //   allowNull :false,
      //   references : {
      //     model : 'address',
      //     key : 'addressid'
      //   }
      // },
      is_admin: {
        type: Sequelize.BOOLEAN,
        default : false
      },
      status:{
        type : Sequelize.SMALLINT,
        default : 0
      },
      created_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      modified_time: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('address', {
      addressid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flat_no: {
        type: Sequelize.STRING(5),
        allowNull: false
      },
      flat_name: {
        type: Sequelize.STRING(30)
      },
      street: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      city: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      state: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      pincode: {
        type: Sequelize.STRING(6),
        allowNull: false
      },
      user_id : {
        type: Sequelize.INTEGER,
        allowNull :false,
        references : {
          model : 'user_details',
          key : 'user_id'
        }
      },
      address_type: {
        type: Sequelize.SMALLINT,
        default : 1
      },
      created_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      modified_time: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('amart_constants', {
      constant_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type : {
        type : Sequelize.SMALLINT,
        allowNull : false    
      }
    });

    await queryInterface.createTable('sub_category_details', {
      sub_category_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sub_category_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      category_id : {
        type: Sequelize.INTEGER,
        allowNull :false,
        references : {
          model : 'amart_constants',
          key : 'constant_id'
        }
      }
    });

    await queryInterface.createTable('base_items', {
      base_item_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      item_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      item_info: {
        type: Sequelize.JSON,
        allowNull: false
      },
      created_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model : 'user_details',
          key : 'user_id'
        }
      }
    });

    await queryInterface.createTable('product_details', {
      product_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      additional_info: {
        type: Sequelize.JSON,
        allowNull: false
      },
      available_quantity: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default : true
      },
      original_price: {
        type: Sequelize.REAL,
        allowNull :false
      },
      discounted_price: {
        type: Sequelize.REAL,
        allowNull :false
      },
      created_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull :false,
        references : {
          model : 'user_details',
          key : 'user_id'
        }
      },
      base_item : {
        type: Sequelize.INTEGER,
        allowNull :false,
        references : {
          model : 'base_items',
          key : 'base_item_id'
        }
      },
      category_id : {
        type: Sequelize.INTEGER,
        allowNull :false,
        references : {
          model : 'amart_constants',
          key : 'constant_id'
        }
      },
      sub_category_id : {
        type: Sequelize.INTEGER,
        allowNull :false,
        references : {
          model : 'sub_category_details',
          key : 'sub_category_id'
        }
      },
      modified_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });

    await queryInterface.createTable('invoice', {
      invoice_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      total_items_brought: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      total_amount: {
        type: Sequelize.REAL,
        allowNull: false
      },
      payment_source: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      brought_by: {
        type: Sequelize.INTEGER,
        allowNull :false,
        references : {
          model : 'user_details',
          key : 'user_id'
        }
      },
      delivery_address: {
        type: Sequelize.INTEGER,
        allowNull :false,
        references : {
          model : 'address',
          key : 'addressid'
        }
      },
      status : {
        type: Sequelize.SMALLINT,
        allowNull :false,
        default : 0
      },
      ordered_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });

    await queryInterface.createTable('invoice_line_items', {
      invoice_line_item_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull :false,
        references : {
          model : 'product_details',
          key : 'product_id'
        }
      },
      quantity: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      item_price: {
        type: Sequelize.REAL,
        allowNull: false
      },
      total_price: {
        type: Sequelize.REAL,
        allowNull :false,
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull :false,
        references : {
          model : 'invoice',
          key : 'invoice_id'
        }
      },
      added_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });

    await queryInterface.createTable('amart_fields', {
      field_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      field_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model : 'amart_constants',
          key : 'constant_id'
        }
      }
    });

    await queryInterface.createTable('audit_logs', {
      audit_log_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model : 'user_details',
          key : 'user_id'
        }
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model : 'amart_constants',
          key : 'constant_id'
        }
      },
      actions : {
        type : Sequelize.STRING(50),
        allowNull : false
      },
      fields_affected : {
        type : Sequelize.JSON,
        allowNull : false
      },
      audited_time: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropAllTables();
  }
};