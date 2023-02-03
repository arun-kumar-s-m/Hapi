const Hapi = require('hapi'),user = require('./User'),loggingFunction = require('./helperfunctions.js'),jwt = require('jsonwebtoken'),winston = require('winston');
const Joi = require('joi');
const { Queue, Worker} = require('bullmq');
const nodemailer = require('nodemailer');
// const loggerFile = require('./logger.js')
const logger = require('./logger.js');
const {Sequelize , DataTypes} = require('sequelize');
const sequelize = require('./sequelize-init');
const invoice = require('./modelsnn/invoice');
const {insertDocumentsToELK,createIndex,searchForText,deleteIndicesInElastic,checkWhetherIndexExists} = require('./search/elasticSearch');

const {createClient} = require('redis');

const redisClient = createClient();
/* ELK ARK 
const { Client } = require("@elastic/elasticsearch");
*/

/* ELK ARK 
const elasticClient = new Client({
  cloud: {
    id: "My_deployment:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRhODk0ZjAzOTg2N2Y0NDhkYjdjZDRmOGI3N2Q0MmVkMiRhZGJlM2JlMzkyMDA0OWQ2YTM5ZDg5YmNkYjY3YjYxYw==",
  },
  auth: {
    username: 'elastic',
    password: 'wKec5jdSLWI7vauiAfiZ8Yrq',
  },
});
*/

// const elasticClient = require('./ElasticSearch/elastic-client');
// const createIndex = require('./ElasticSearch/create-index');


// const elasticClient = require("./elastic-client");
/* ELK ARK 
const createIndex = async (indexName) => {
  await elasticClient.indices.create({ index: indexName });
  console.log("Index created with elastic name as ::: ",indexName);
};
*/

// let transporter = nodemailer.createTransport("SMTP",{
//     service : 'outlook',
//     auth :{
//         user : 'ar98mu@outlook.com',
//         pass : 'arun90957'
//     }
// });

const xoauth2 = require('xoauth2');


// let transporter = nodemailer.createTransport({
//   service: 'Gmail', 
//   auth: {
//     xoauth2: xoauth2.createXOAuth2Generator({
//         type: "login", 
//         user: 'arra98mu11@gmail.com',
//         pass : 'arun$123'
//     })
// }
// });

var transporter = nodemailer.createTransport({      
    host: "smtp.gmail.com",
    auth: {
      type: "OAuth2",
      user: "arra98mu11@gmail.com",
      clientId: "475941257704-eh3ui26428d1pifudsj9p429v0fne1jb.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken: "1//0g83Af94vfoIICgYIARAAGBASNgF-L9Ir2RGsZ6or1yRwLeiEbV_ADC1WJJEbLmS17CZtYMC8P24ZLvFQPKT6x8eireq_mxl_ZA"                              
    }
  });


const myQueue = new Queue('Queue_1');
myQueue.add('Job_1',{name : 'arun'});
myQueue.add('Job_2',{name : 'kumar'});

const worker = new Worker('Queue_1', async job => {
    console.log('Worker executing job');
    console.log(job.data);
    let data = job.data;
    console.log('Hi ',data.name);
    console.log('Worker completed executing job');
  });

myQueue.add('Job_3',{name : 'arun_2'});

const newUserQueue = new Queue('NewUser');
const newUserWorker = new Worker('NewUser', async job => {
    const data = job.data;
    logger.info({message : `Worker started processing JOB :: ${job.name}`});

    let signupMailOptions = {
        from : 'arra98mu11@gmail.com',
        to : data.email,
        subject : 'New account created',
        html : `<h3>Hi ${data.name} , <h3>
                <h4>Welcome to Amart...!!!<h4>
                <p>New Account has been created for you.Kindly access our Amart to explore new things.<p>`
    };
    
    transporter.sendMail(signupMailOptions,function(error,info){
        if(error){
            logger.log({message :`Error occurred while sending mail ${JSON.stringify(error)}`});
            throw error;
        }
        else{
            logger.log({message :`Mail successfully sent to new user ${JSON.stringify(info)}`});
        }
    })

  } );

  const invoiceSendQueue = new Queue('InvoiceProcess');
const invoiceSendWorker = new Worker('InvoiceProcess', async job => {
    const data = job.data;
    logger.info({message : `Worker started processing JOB :: ${job.name}`});
    console.log('Data received :::: ',data);
    let orderedDate = data.invoice.orderedDate;
    orderedDate = orderedDate.replace("T"," ");
    orderedDate = orderedDate.replace("Z"," GMT");
    let msgTable = `<h3>Hi ${data.username} , <h3><p>The following is the Invoice for the order that you had placed on ${orderedDate}</p><table>
                        <tr>
                            <th>Item Name</th>
                            <th style = 'padding: 10%'>Quantity</th>
                            <th style = 'padding: 15%'>Unit Price</th>
                            <th style = 'padding: 15%'>Total Price</th>
                        </tr>`;
    let invoiceItems = data.invoice_line_items;
    invoiceItems.forEach(obj => {
        let str = `<tr><td>${obj["item name"]}</td><td style = 'padding: 10%'>${obj.qty}</td><td style = 'padding: 15%'>${obj.price}</td><td style = 'padding: 15%'>${obj.total}</td></tr>`;
        msgTable += str;
    });
    msgTable += '</table>' ;
    msgTable += `<h4><i>Total items Brought : ${data.invoice.total_items}</i><h4>`;
    msgTable += `<h4><i>Total Amount Paid : ${data.invoice.total_amount}</i><h4>`;
    msgTable += `<h4><i>Payment done through : ${data.invoice.payment_method}</i><h4>`;

    console.log('HTML content created is :: ',msgTable);

    let invoiceMailOptions = {
        from : 'arra98mu11@gmail.com',
        to : data.email,
        subject : 'Invoice details',
        html : msgTable
    };
    
    transporter.sendMail(invoiceMailOptions,function(error,info){
        if(error){
            logger.log({message :`Error occurred while sending invoice mail ${JSON.stringify(error)}`});
            throw error;
        }
        else{
            logger.log({message :`Invoice Mail successfully sent to user ${JSON.stringify(info)}`});
        }
    })

  } );

  newUserWorker.on('progress',(Job) => {
    logger.info({message : `JOB : ${Job.name} EXECUTION STARTED JOB Details : ${JSON.stringify(Job)}`});
    logger.info({message :'SENDING MAIL TO USER ::: '+job.data.email});
  })

  newUserWorker.on('completed',(Job) => {
    logger.info({message : `JOB : ${Job.name} has been executed successfully JOB Details : ${JSON.stringify(Job)}`});
  })

  newUserWorker.on('failed',(Job,error) => {
    logger.info({message : `JOB : ${Job.name} EXECUTION FAILED Details :: ${JSON.stringify(Job)} `});
    logger.error({message : `Failed Reason : ${Job.failedReason} STACK TRACE ::: ${Job.stacktrace}`});
    logger.error({message : `ERROR :: ${error}`});
  })

const User = require('./modelsnn/users');
const Address = require('./modelsnn/address');
const AmartConstants = require('./modelsnn/amartconstants');
const SubCategoryDetails = require('./modelsnn/subcategorydetails');
const BaseItems = require('./modelsnn/baseitems');
const ProductDetails = require('./modelsnn/productdetails'); 
const Invoice = require('./modelsnn/invoice');
const InvoiceLineItems = require('./modelsnn/invoicelineitems');
const AmartFields = require('./modelsnn/amartfields');
const AuditLogs = require('./modelsnn/auditlogs');
const CartDetails = require('./modelsnn/cartdetails');
const { Logger } = require('winston');
const { limit } = require('@hapi/joi/lib/common');
const { required } = require('joi');

User.hasMany(Address,{foreignKey: { name : 'USER_ID',allowNull: false}});
// User.belongsTo(Address,{foreignKey: 'PRIMARY_ADDRESS_ID'});
AmartConstants.hasMany(AmartFields,{foreignKey: {name : 'MODULE_ID',allowNull: false}});
User.hasMany(AuditLogs,{foreignKey: {name : 'USER_ID',allowNull: false}});
AmartConstants.hasMany(AuditLogs,{foreignKey: {name : 'MODULE_ID',allowNull: false}});
User.hasMany(BaseItems,{foreignKey: { name : 'CREATED_USER',allowNull: false}});
User.hasMany(Invoice,{foreignKey: {name : 'BROUGHT_BY',allowNull: false}});
Address.hasMany(Invoice,{foreignKey: {name : 'DELIVERY_ADDRESS',allowNull: false}});
Invoice.hasMany(InvoiceLineItems,{foreignKey: {name : 'INVOICE_ID',allowNull: false}});
ProductDetails.hasMany(InvoiceLineItems,{foreignKey: {name: 'PRODUCT_ID',allowNull: false}});
User.hasMany(ProductDetails,{foreignKey: {name : 'CREATED_USER',allowNull: false}});
BaseItems.hasMany(ProductDetails,{foreignKey: {name : 'BASE_ITEM_ID',allowNull: false}});
AmartConstants.hasMany(ProductDetails,{foreignKey: {name : 'CATEGORY_ID',allowNull: false}});
SubCategoryDetails.hasMany(ProductDetails,{foreignKey: {name : 'SUB_CATEGORY_ID',allowNull: false}});
AmartConstants.hasMany(SubCategoryDetails,{foreignKey: {name : 'CATEGORY_ID',allowNull: false}});
User.hasMany(CartDetails,{foreignKey : {name : 'USER_ID',allowNull :false}});
ProductDetails.hasMany(CartDetails,{foreignKey : {name : 'PRODUCT_ID',allowNull :false}});
ProductDetails.belongsTo(BaseItems,{foreignKey: {name : 'BASE_ITEM_ID',allowNull: false}});
ProductDetails.belongsTo(AmartConstants,{foreignKey: {name : 'CATEGORY_ID',allowNull: false}});
ProductDetails.belongsTo(SubCategoryDetails,{foreignKey: {name : 'SUB_CATEGORY_ID',allowNull: false}});




sequelize.sync({alter : true}).then(() => {
    console.log('Syncing of tables occurred successfully');
}).catch(err =>{
    console.log("error occurred : ",err);
});

// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite

// sequelize.sync().then((result) => {
//     console.log('Sync happened successfully RESULT : ',result);
// }).catch((err) => {
//     console.log('Error occurred while syncing.... ',err);
// });

// const sequelize = new Sequelize('postgres://arunkumarsm:@localhost.com:5432/postgresql_learn',{
//     logging: (...msg) => console.log(msg)
// });

// const sequelize = new Sequelize('postgresql_learn', 'arunkumarsm', '', {
//     host: 'localhost',
//     dialect: 'postgres'/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
//   });



//  const User = sequelize.define('UserDetails',{
//     USER_ID : {
//         type : DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     FIRST_NAME : {
//         type : DataTypes.STRING(30),
//         allowNull: false
//     },
//     LAST_NAME : {
//         type : DataTypes.STRING(30),
//     },
//     USERNAME : {
//         type : DataTypes.STRING(50),
//         allowNull: false
//     },
//     PASSWORD : {
//         type : DataTypes.STRING(50),
//         allowNull: false
//     },
//     EMAIL : {
//         type : DataTypes.STRING(50),
//         allowNull: false,
//         unique: true
//     },
//     PHONE : {
//         type : DataTypes.STRING(10),
//         allowNull: false,
//         unique: true
//     },
//     IS_ADMIN : {
//         type : DataTypes.BOOLEAN,
//         defaultValue: false 
//     },
//     STATUS : {
//         type : DataTypes.INTEGER,
//         defaultValue : 0
//     }
//  },{
//     timestamps: true,
//     createdAt: 'CREATED_TIME',
//     updatedAt: false
//  }); 

// async function authCheck(){
//     console.log("in authchekc..");
//     await sequelize.authenticate()
//     console.log("after authchekc....");
// }

try {
    // await sequelize.authenticate()
    // authCheck()
    // .then(()=>{
    //     console.log("sucess");
    // })
    // .catch((err)=>{
    //     console.log(err);
    // })
    // console.log('Connection has been established successfully. POSTGRESQL Sequelise');
    // const db = {};
    // db.Sequelize = Sequelize;
    // db.sequelize = sequelize;
    // db.userdetails = require('./modelsnn/users')(sequelize,DataTypes);
    // db.
    // await sequelize.authenticate()
   // ----------      MODELS LOADING SECTION -----------
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }


// const {createLogger,format,transports} = require('winston');
// const {timestamp,combine,printf,errors} = format;
// console.log(process.env.NODE_ENV , typeof process.env.NODE_ENV);
// if(process.env.NODE_ENV == 'production'){
//     logger = createLogger({
//         level : 'info',
//         format : format.json(),
//         transports : [
//             new transports.File({filename : 'productionerror.log'})
//         ]
//     })
// }
// let  logger = null;

// if(process.env.NODE_ENV === 'development'){
//     logger = loggerFile.devLogger();
// }
// else{
//     logger = loggerFile.logger.productionLogger();
// }
// Jwt = require('@hapi/jwt')
// const JWTAuth = require('hapi-auth-jwt2');
console.log('Arun Kumarrr');

function addRemoteIPToFileLogger(message , remote_ip,path,method){
    let obj_2 = {};
    obj_2['message'] = message;
    console.log(remote_ip);
    obj_2['Remote IP Address'] = remote_ip; 
    obj_2['Path'] = String(path).toUpperCase();
    obj_2['Method'] = String(method).toUpperCase();
    return obj_2;
}

// logger.info(addRemoteIPToFileLogger('Info','192.192.192.75','/signup','GET'));
// logger.warn(addRemoteIPToFileLogger('Warn','192.192.192.75','/signin','POST'));
// logger.error(addRemoteIPToFileLogger('Error','192.192.192.75','/form','PUT'));
// logger.debug(addRemoteIPToFileLogger('Debug','192.192.192.75','/survey','DELETE'));
// logger.error(new Error('Testing the custom error thrown'));

// myQueue.add('Job_4',{name : 'arun_4'});
// const categoryWithSubCategories = {};
// categoryWithSubCategories['electronics'] = {};
// categoryWithSubCategories['electronics']['pendrives'] = ['hp_64_gb','sandish_64_gb','transcend_64_gb'];
// categoryWithSubCategories['electronics']['phones'] = ['iphone14','oneplus10','samsung galaxy Z1 ultra'];
// categoryWithSubCategories['clothes'] = {};
// categoryWithSubCategories['clothes']['tshirts'] = ['tshirt A','tshirt B','tshirt C'];
// categoryWithSubCategories['clothes']['jeans'] = ['jean A','jean B','jean C'];

function tokenValidator(token,ip,path,method){
    let decoded = '';
    // jwt.verify(token, 'SECRET_KEY_ARUN').then((decodedd) => {
    //     if(typeof decodedd != 'object'){
    //         return 'Invalid token being passed in the header';
    //     }
    //     else{
    //         let uname = decodedd.username, pwd = decodedd.password, user_id = decodedd.user_id,resp = {} , status = 500;
    //         User.findOne({where : {USER_ID : user_id, USERNAME : uname , PASSWORD : pwd}}).then(result => {
    //             console.log('RESULT OF QUERY :::::::: ',result);
    //             if(result == null){
    //                 return 'Invalid token being passed in the header';
    //             }
    //             else{
    //                 let result = {};
    //                 result['message'] = 'success';
    //                 result['uname'] = uname;
    //                 result['user_id'] = user_id;
    //                 return result;
    //             }
    //         })
    //     }
    // }).catch((err) =>  {
    //     console.log('Error occurred :::::: ',err);
    //     return err;
    // });
    jwt.verify(token, 'SECRET_KEY_ARUN',function(err,decodedd){
        let resp = {};
        if(err){
            console.log('Any error occurred :::::: ',err);
            logger.info(addRemoteIPToFileLogger(`Any error occurred :::::: ${err}`,ip,path,method));
            return err;
        }
        else{
            decoded = decodedd;
        }
    });

    console.log('Decoded value : ',decoded);
    console.log(typeof decoded);

    if(typeof decoded != 'object'){
        return 'Invalid token being passed in the header';
    }
    else{
        // let resp ;
        // await User.findOne({where : {USER_ID : decoded.USER_ID, STATUS : 0 }}).then(result => {
        //     console.log('RES IS : ',result);
        //     resp = decoded;
        // }).catch(err =>{
        //     resp = 'Invalid token being passed in the header';
        // })
        return decoded;
        // return decoded;
        // let uname = decoded.username, pwd = decoded.password, user_id = decoded.user_id,resp = {} , status = 500;
        // User.findOne({where : {USER_ID : user_id, USERNAME : uname , PASSWORD : pwd}}).then(result => {
        //     console.log('RESULT OF QUERY :::::::: ',result);
        //     if(result == null){
        //         return 'Invalid token being passed in the header';
        //     }
        //     else{
        //         let result = {};
        //         result['message'] = 'success';
        //         result['uname'] = uname;
        //         result['user_id'] = user_id;
        //         return result;
        //     }
        // })
    }
}
// const products = {
//     'jean A' : {
//         name : 'jean A',
//         available_sizes : '32,34,36,38',
//         price_in_Rs : 1000,
//         discounted_price : 900,
//         Out_of_stock : false
//     },
//     'jean B' : {
//         name : 'jean B',
//         available_sizes : '32,34',
//         price_in_Rs : 1200,
//         discounted_price : 1150,
//         Out_of_stock : false
//     },
//     'jean C' : {
//         name : 'jean C',
//         available_sizes : '36,38',
//         price_in_Rs : 15000,
//         discounted_price : 1300,
//         Out_of_stock : false
//     },
//     'tshirt A' : {
//         name : 'tshirt A',
//         available_sizes : '38,40,42,44',
//         price_in_Rs : 500,
//         discounted_price : 450,
//         Out_of_stock : false
//     },
//     'tshirt B' : {
//         name : 'tshirt B',
//         available_sizes : '40,42,44',
//         price_in_Rs : 400,
//         discounted_price : 380,
//         Out_of_stock : false
//     },
//     'tshirt C' : {
//         name : 'tshirt C',
//         available_sizes : '38,42,44',
//         price_in_Rs : 200,
//         discounted_price : 190,
//         Out_of_stock : false
//     },
//     'iphone14' : {
//         name : 'iPhone 14 3GB RAM, 128GB internal',
//         price_in_Rs : 60000,
//         discounted_price : 55000,
//         Out_of_stock : false
//     },
//     'oneplus10' : {
//         name : 'OnePlus 10 8GB RAM, 128GB internal',
//         price_in_Rs : 40000,
//         discounted_price : 33000,
//         Out_of_stock : false
//     },
//     'samsung galaxy Z1 ultra' : {
//         name : 'Samsung Galaxy Z1 Ultra 12GB RAM, 256GB internal',
//         price_in_Rs : 70000,
//         discounted_price : 66000,
//         Out_of_stock : false
//     },
//     'hp_64_gb' : {
//         name : 'HP 64 GB Pendrive',
//         price_in_Rs : 400,
//         discounted_price : 350,
//         Out_of_stock : false
//     },
//     'sandish_64_gb' : {
//         name : 'Sandisk 64 GB Pendrive',
//         price_in_Rs : 200,
//         discounted_price : 150,
//         Out_of_stock : false
//     },
//     'transcend_64_gb' : {
//         name : 'Transcend 64 GB Pendrive',
//         price_in_Rs : 300,
//         discounted_price : 250,
//         Out_of_stock : false
//     }
// };

// import User from './User.js';

// const init = async () => {

//     const server = Hapi.server({
//         port: 3000,
//         host: 'localhost'
//     });

//     await server.start();
//     console.log('Server running on %s', server.info.uri);
// };
let server = Hapi.server({
    port: 3000,
    host: 'localhost'
});
let active_user_list = {},admin_user_list = [],registered_email_ids = [],logs = {},userCartDetails = {},userOrderedItems = [];

// const validate = async function (decoded, request, h) {
 
//     // do your checks to see if the person is valid
//     if (!(decoded.user in active_user_list)) {
//       return { isValid: false };
//     }
//     else {
//       return { isValid: true };
//     }
// };
let moduleWithIdDetails = {};
const init = async () => {

    server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    // await User.sync();
    // console.log("The table for the User model was just (re)created!");
    // sequelize.sync({ alter: true }).then((result) => {
    //     console.log('Sync happened successfully RESULT : ',result);
    // }).catch((err) => {
    //     console.log('Error occurred while syncing.... ',err);
    // });
    console.log('in init');
    await server.start();
    await redisClient.connect();
    redisClient.on('error', (err) => logger.log({message : `Redis Client Error ${JSON.stringify(err)}`}));
    const elasticIndexCreation = checkWhetherIndexExists('baseproductsearch');
    /*ELK ARK
    let checkingWhetherIndexExists = await elasticClient.indices.exists({
        index :  'baseproductsearch'
    });
    if(!checkingWhetherIndexExists){
        createIndex('baseproductsearch');
    } 
    */
    console.log('Checker result ::: ',elasticIndexCreation);
    // createIndex('baseproductsearch');
    // require('./modelsnn/index');
    // await elasticClient.ping({
    //     requestTimeOut : 1000,
    // },function(error){
    //     if(error){
    //         console.log('Elastic Search Cluster is down');
    //     }
    //     else{
    //         console.log('Elastic Search Cluster is up and started running now');
    //     }
    // });
    let module = await AmartConstants.findAll({where : { TYPE : 1}});
    console.log('MODULE ::::: ' ,module);
    for(const [key,value] of  Object.entries(module)){
        moduleWithIdDetails[value.VALUE] = value.CONSTANT_ID;
    }
    await server.register(require('hapi-geo-locate',(err) => {
            if(err){
                throw err
            }
        }
    
    ));

    // server.auth.strategy('jwt', 'jwt',
    // { 
    //     key: 'NeverShareYourSecret', // Never Share your secret key
    //     validate  // validate function defined above
    // });
    // server.auth.default('jwt');

    // console.log('JWT registered');
    // // await server.register([{
    // //     plugin : require('hapi-auth-jwt2')
    // // }])
    // console.log('JWT registered');
    // await server.register(Jwt,(err) => {
    //     if(err){
    //         throw err
    //     }
    // });
    console.log('Server started');
    console.log('Info about the server : ',server.info); 
    /*
        {
            created: 1672035059269,
            started: 1672035059272,
            host: 'localhost',
            port: 3000,
            protocol: 'http',
            id: 'SSLAP0277.local:7524:lc4ei4p1',
            uri: 'http://localhost:3000',
            address: '::1'
        }
    */   
    console.log('URI to access the server : ',server.info.uri); // URI to access the server :  http://localhost:3000
    // console.log('Server running on %s', server.info.uri);
    // try{
    //     console.log("auth check");
    //     // console.log(sequelize);
    //     // await sequelize.authenticate();
    //     console.log("auth success");
    // }
    // catch(err){
    //     console.log(err);
    // }
};

// const validate = async function (artifacts,decoded, request, h) {
 
//     let payload = artifacts.decoded.payload,uname = payload.user;
//         if(!(active_user_list.includes(uname))){
//             return {isValid : false};
//         }
//         else{
//             let userdetails = active_user_list[uname];
//             if(userdetails['email'] != payload.email || userdetails['password'] != payload.pwd){
//                 return {isValid : false};
//             }
//             else{
//                 return {isValid : true};
//             }
//         }
// };

// server.auth.strategy('login', 'jwt', {
//     key: 'topSecretKey_ToBePutInFileInProductionEnv',
//     validate ,
//     verifyOptions: {
//         algorithm: ['HS256'],
//     },
// });

// server.auth.strategy('login','jwt',{
//     keys : 'some_shared_secret',
//     verify: {
//         aud: 'urn:audience:test',
//         iss: 'urn:issuer:test',
//         maxAgeSec: 14400, // 4 hours
//     },
//     validate: (artifacts, request, h) => {
//         return {isValid : true};
//         // let payload = artifacts.decoded.payload,uname = payload.user;
//         // if(!(active_user_list.includes(uname))){
//         //     return {isValid : false};
//         // }
//         // else{
//         //     let userdetails = active_user_list[uname];
//         //     if(userdetails['email'] != payload.email || userdetails['password'] != payload.pwd){
//         //         return {isValid : false};
//         //     }
//         //     else{
//         //         return {isValid : true};
//         //     }
//         // }
//     }

// });
// server.auth.default('login');
process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
// sequelize.sync({ alter: true }).then((result) => {
//     console.log('Sync happened successfully RESULT : ',result);
// }).catch((err) => {
//     console.log('Error occurred while syncing.... ',err);
// });

server.events.on('response', function (request) {
    let obj = {};
    obj['query params'] = request.query;
    obj['payload'] = request.payload;
    obj['headers'] = request.headers;
    obj['response'] = request.response.source;
    obj['response status code'] = request.response.statusCode;
    console.log(obj);
    console.log('Response received is  ::::: ',request.response.source)
    // logger.info(addRemoteIPToFileLogger('Inside POST sign up request with ',request.location.ip,path,method));
    logger.info(addRemoteIPToFileLogger(JSON.stringify(obj), request != undefined && request.location != undefined ? request.location.ip : '',request != undefined ? request.path : '',request != undefined ? request.method : ''));
    logger.info(addRemoteIPToFileLogger('Inside server events on ', request != undefined && request.location != undefined  ? request.location.ip : '',request != undefined ?request.path : '',request != undefined ? request.method : ''));
    // logger.log(request.location.ip + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode);
});

server.route(
    [{
        method : 'GET',
        path : '/',
        handler : function(request,reply){
            console.log('-----------------      ARUN      --------------')
            return 'Arun started Hapi framework';
        }
    },
    {
        method : 'GET',
        path : '/getcategories',
        handler : async function(request,h){
            let headers = request.headers,method = 'GET',path = '/getAllProducts';
            let authHeader = headers['authorization'],products = {};
            if(authHeader == undefined){
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ','');
            resp = tokenValidator(token,request.location.ip,path,method);
            // console.log('RESPONSE RECEIVED ::::::::::: ',resp);
                if(typeof resp != 'object'){
                    logger.info(addRemoteIPToFileLogger(resp,request.location.ip,path,method));
                    return h.response(resp).code(401);
                }
                else{
                    logger.info(addRemoteIPToFileLogger(`Token successfully validated and response username : ${resp.username} password : ${resp.password} user ID : ${resp.user_id}`,request.location.ip,path,method));
                }
            let query_params = request.query,category = query_params['category'],sub_category = query_params['sub category'],obj = {},updateJson = {},from = query_params['offset'], fromRange = ( from != null && !isNaN(Number(from)))  ? from : 0;
            try{
            // if(sub_category != undefined && category != undefined){
            //     if(isNaN(category)){
            //         return h.response({msg : 'Improper value provided for category param'}).code(200);
            //     }
            //     else if(isNaN(sub_category)){
            //         return h.response({msg : 'Improper value provided for sub category param'}).code(200);
            //     }
            //     updateJson = { where : { SUB_CATEGORY_ID : sub_category , CATEGORY_ID : category},offset : fromRange,limit : 10 };
            // }
            // else if(sub_category != undefined){
            //     if(isNaN(sub_category)){
            //         return h.response({msg : 'Improper value provided for sub category param'}).code(200);
            //     }
            //     updateJson = { where : { SUB_CATEGORY_ID : sub_category},offset : fromRange,limit : 10 };
            // }
            // else if(category != undefined){
            //     if(isNaN(category)){
            //         return h.response({msg : 'Improper value provided for category param'}).code(200);
            //     }
            //     updateJson = { where : { CATEGORY_ID : category},offset : fromRange,limit : 10 };
            // }
            updateJson.order = [['CREATED_TIME','DESC']];
            // updateJson.include = [{
            //     model : BaseItems,
            //     required : true
            // }];
            // const products = await ProductDetails.findAll(updateJson);
            products = await ProductDetails.findAll({include : [{
                    model : AmartConstants
                },{
                    model : SubCategoryDetails
                }],
                group : [['AmartConstant.CONSTANT_ID','ASC'],['SubCategoryDetails.SUB_CATEGORY_ID','ASC'],['PRODUCT_ID','ASC']]});
            console.log('Product Details :: ',products);
            // lproducts = await BaseItems.findAll({
            //     include : [{
            //         model : ProductDetails,
            //         where : { SUB_CATEGORY_ID : sub_category , CATEGORY_ID : category},
            //         order : [['CREATED_TIME','DESC']],
            //         required : true,
            //     }]
            // });
            // console.log(products);
            // for(let [key,value] of Object.entries(products)){
            //     console.log('KEY :: ',key,'VALUE :: ',value);
            // }
            // console.log('Total length',Object.keys(products).length);
            if(Object.keys(products).length == 0){
                products.message = 'No results found.Reason could be improper values provided in the input';
            }

        }
        catch(err){
            logger.error(addRemoteIPToFileLogger(`Unable to get the products from DB ${err}`,request.location.ip,path,method));
        }
            return h.response(products).code(200);
        },
        config : {
            // validate : {
            //     query : Joi.object(
            //         {
            //             'category' : Joi.string().min(1).max(2),
            //             'sub category' : Joi.string().min(1).max(2),
            //             offset : Joi.string().min(1).max(2)
            //         }
            //     ),
            //     failAction : function (request,h , source, error) {
            //         return h.response({ code: 400, message: source.details[0].message}).takeover().code(400);
            //     }
            // },
            description : 'This API is for listing the products along with their details based on the Category and Sub Category fields',
            notes : `category and subcategory fields are being used as query params for filtering the results
                    If category provided doesn't match with the category of the products available then all products will be listed
                    Similarly when category matches and subcategory doesn't match then all products in that category will be shown`
        }
    },
    {
        method : 'GET',
        path : '/getAllProducts',
        handler : async function(request,h){
            let headers = request.headers,method = 'GET',path = '/getAllProducts';
            let authHeader = headers['authorization'],products = {};
            if(authHeader == undefined){
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ','');
            resp = tokenValidator(token,request.location.ip,path,method);
            // console.log('RESPONSE RECEIVED ::::::::::: ',resp);
                if(typeof resp != 'object'){
                    logger.info(addRemoteIPToFileLogger(resp,request.location.ip,path,method));
                    return h.response(resp).code(401);
                }
                else{
                    logger.info(addRemoteIPToFileLogger(`Token successfully validated and response username : ${resp.username} password : ${resp.password} user ID : ${resp.user_id}`,request.location.ip,path,method));
                }
            let query_params = request.query,category = query_params['category'],sub_category = query_params['sub category'],obj = {},updateJson = {},from = query_params['offset'], fromRange = ( from != null && !isNaN(Number(from)))  ? from : 0;
            try{
            // if(sub_category != undefined && category != undefined){
            //     if(isNaN(category)){
            //         return h.response({msg : 'Improper value provided for category param'}).code(200);
            //     }
            //     else if(isNaN(sub_category)){
            //         return h.response({msg : 'Improper value provided for sub category param'}).code(200);
            //     }
            //     updateJson = { where : { SUB_CATEGORY_ID : sub_category , CATEGORY_ID : category},offset : fromRange,limit : 10 };
            // }
            // else if(sub_category != undefined){
            //     if(isNaN(sub_category)){
            //         return h.response({msg : 'Improper value provided for sub category param'}).code(200);
            //     }
            //     updateJson = { where : { SUB_CATEGORY_ID : sub_category},offset : fromRange,limit : 10 };
            // }
            // else if(category != undefined){
            //     if(isNaN(category)){
            //         return h.response({msg : 'Improper value provided for category param'}).code(200);
            //     }
            //     updateJson = { where : { CATEGORY_ID : category},offset : fromRange,limit : 10 };
            // }
            updateJson.order = [['CREATED_TIME','DESC']];
            // updateJson.include = [{
            //     model : BaseItems,
            //     required : true
            // }];
            // const products = await ProductDetails.findAll(updateJson);
            products = await ProductDetails.findAll({
                include : [
                    {
                        model : BaseItems
                    }
                ]
            });
            console.log('Product Details :: ',products);
            // let productArray = [];
            // Object.keys(products).map((product) => productArray.push(products[product]));
            // console.log('Product array type ::: ',typeof productArray);
            // lproducts = await BaseItems.findAll({
            //     include : [{
            //         model : ProductDetails,
            //         where : { SUB_CATEGORY_ID : sub_category , CATEGORY_ID : category},
            //         order : [['CREATED_TIME','DESC']],
            //         required : true,
            //     }]
            // });
            // console.log(products);
            // for(let [key,value] of Object.entries(products)){
            //     console.log('KEY :: ',key,'VALUE :: ',value);
            // }
            // console.log('Total length',Object.keys(products).length);
            if(Object.keys(products).length == 0){
                products.message = 'No results found.Reason could be improper values provided in the input';
            }
            return h.response(products).code(200);
        }
        catch(err){
            logger.error(addRemoteIPToFileLogger(`Unable to get the products from DB ${err}`,request.location.ip,path,method));
        }
            return h.response(products).code(200);
        },
        config : {
            validate : {
                query : Joi.object(
                    {
                        'category' : Joi.string().min(1).max(2),
                        'sub category' : Joi.string().min(1).max(2),
                        offset : Joi.string().min(1).max(2)
                    }
                ),
                failAction : function (request,h , source, error) {
                    return h.response({ code: 400, message: source.details[0].message}).takeover().code(400);
                }
            },
            description : 'This API is for listing the products along with their details based on the Category and Sub Category fields',
            notes : `category and subcategory fields are being used as query params for filtering the results
                    If category provided doesn't match with the category of the products available then all products will be listed
                    Similarly when category matches and subcategory doesn't match then all products in that category will be shown`
        }
    },
    {
        method : 'GET',
        path : '/getProducts',
        handler : async function(request,h){
            let headers = request.headers,method = 'GET',path = '/getAllProducts';
            let authHeader = headers['authorization'],products = {};
            const limit = 5;
            if(authHeader == undefined){
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ','');
            resp = tokenValidator(token,request.location.ip,path,method);
            // console.log('RESPONSE RECEIVED ::::::::::: ',resp);
                if(typeof resp != 'object'){
                    logger.info(addRemoteIPToFileLogger(resp,request.location.ip,path,method));
                    return h.response(resp).code(401);
                }
                else{
                    logger.info(addRemoteIPToFileLogger(`Token successfully validated and response username : ${resp.username} password : ${resp.password} user ID : ${resp.user_id}`,request.location.ip,path,method));
                }
            let query_params = request.query,pagenumber = query_params['pagenum'];
            try{
                // updateJson.order = [['CREATED_TIME','DESC']];
                products = await ProductDetails.findAll({
                    attributes: [["PRODUCT_ID",'id'],["ADDITONAL_INFO",'item_addn_details'],["ORIGINAL_PRICE",'original_price'],["DISCOUNTED_PRICE",'discounted_price']],
                    include : [
                        {
                            model : BaseItems,
                            attributes: [["ITEM_NAME",'item_name']]
                        }
                    ],
                    order : [['CREATED_TIME','DESC']],
                    offset:(pagenumber - 1) * limit,
                    limit : limit,
                });
                console.log('Product Details :: ',products);
                if(Object.keys(products).length == 0){
                    products.message = 'No results found.Reason could be improper values provided in the input';
                }
                return h.response(products).code(200);
            }
            catch(err){
                logger.error(addRemoteIPToFileLogger(`Unable to get the products from DB ${err}`,request.location.ip,path,method));
                logger.error({message : `ERROR MESSAGE : ${err.message} ERROR STACK ::::::: ${err.stack}`});
                logger.error({message : `ERROR DETAILS : ${JSON.stringify(err.errors)}`});
            }
            return h.response(products).code(200);
        },
        config : {
            validate : {
                query : Joi.object(
                    {
                        pagenum : Joi.number().min(1).max(6).required()
                    }
                ),
                failAction : function (request,h , source, error) {
                    return h.response({ code: 400, message: source.details[0].message}).takeover().code(400);
                }
            },
            description : 'This API is for listing the products along with their details based on the Category and Sub Category fields',
            notes : `category and subcategory fields are being used as query params for filtering the results
                    If category provided doesn't match with the category of the products available then all products will be listed
                    Similarly when category matches and subcategory doesn't match then all products in that category will be shown`
        }
    },
    {
        method : 'POST',
        path : '/addcategory',
        handler : async function(request,h){
            let path = '/addcategory',method = request.method,output = {} , status = 500,payload = request.payload;
            let authHeader = request.headers['authorization'];
            if(authHeader == undefined){
                logger.warn((addRemoteIPToFileLogger(`Header value is missing in the request `,request.location.ip,path,method)));
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
            if(typeof resp != 'object'){
                logger.warn((addRemoteIPToFileLogger('Decoded value of the token isn\'t an object ',request.location.ip,path,method)));
                return h.response(resp).code(401);
            }
            try{
                // const result = await User.findOne({where : { USER_ID : resp.user_id }});
                // let res = await redisClient.hGetAll('USER_DETAILS');
                // console.log('Result ANSWER :: ',res);
                // console.log('resp :::: ',resp);
                // console.log('resp type :::: ',typeof resp);
                // console.log('resp USERID :::: ',resp.user_id);
                // console.log('type of USERID :::: ',typeof resp.user_id);
                let result = await redisClient.hGet('USER_DETAILS',String(resp.user_id));
                // console.log('Result 123 ANSWER :: ',result);
                // result = JSON.parse(result);
                // console.log('result.IS_ADMIN :: ',result.IS_ADMIN);
                // console.log('type of result.IS_ADMIN :: ',typeof result.IS_ADMIN);
                if(result == null || result.IS_ADMIN == false){
                    output.msg = 'User isn\'t admin So unable to perform the action';
                    status = 401;
                }
                else{
                    let categoryId,updateJson = {VALUE : payload['name'] , TYPE : 0 };
                    try{
                        const category = await AmartConstants.create(updateJson);
                        categoryId = category.CONSTANT_ID;
                        logger.info(addRemoteIPToFileLogger(`Successfully created category ID : ${categoryId}`,request.location.ip,path,method));
                        output.msg = 'Successfully created category';
                        output['category id'] = categoryId;
                        status = 200;
                        const auditlog = await AuditLogs.create({ACTIONS : 'New Category addition',FIELDS_AFFECTED : updateJson,RECORD_ID : categoryId,USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['Category']});
                        logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                    
                    }
                    catch(err){
                        output.msg = 'Error occurred while creating category';
                        logger.error(addRemoteIPToFileLogger(`Error occurred while creating Category  ${err}`,request.location.ip,path,method));
                    }
                }
            }
            catch(err){
                output.msg = 'Error occurred while creating category';
                logger.error(addRemoteIPToFileLogger(`Error occurred while checking user is Admin: : ${err}`,request.location.ip,path,method));
                logger.error({message : `ERROR MESSAGE : ${err.message} ERROR STACK ::::::: ${err.stack}`});
                logger.error({message : `ERROR DETAILS : ${JSON.stringify(err.errors)}`});
            }
            return h.response(output).code(status);

        },
        config: {
            validate : {
                    payload : Joi.object(
                        {
                            name : Joi.string().min(4).max(25).required()
                        }
                    ),
                    failAction : function (request,h , source, error) {
                        return h.response({ code: 400, message: source.details[0].message}).takeover().code(400);
                    }
            }
        }
    },
    {
        method : 'POST',
        path : '/addsubcategory',
        handler : async function(request,h){
            let path = '/addsubcategory',method = request.method,output = {} , status = 500,payload = request.payload;
            let authHeader = request.headers['authorization'];
            if(authHeader == undefined){
                logger.warn((addRemoteIPToFileLogger(`Header value is missing in the request `,request.location.ip,path,method)));
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
            if(typeof resp != 'object'){
                logger.warn((addRemoteIPToFileLogger('Decoded value of the token isn\'t an object ',request.location.ip,path,method)));
                return h.response(resp).code(401);
            }
            try{
                // const result = await User.findOne({where : { USER_ID : resp.user_id }});
                const result = await redisClient.hGet('USER_DETAILS',String(resp.user_id));
                if(result == null ||result.IS_ADMIN == false){
                    output.msg = 'User isn\'t admin So unable to perform the action';
                    status = 401;
                }
                else{
                    let categoryId = payload['categoryid'],name = payload['subcategory name'],subcategoryId;
                    const category = await AmartConstants.findOne({ where : {CONSTANT_ID : categoryId}});
                    if(category == null){
                        output.msg = 'Invalid category Id being provided';
                        status = 401;
                    }
                    else{
                        let updateJson = { SUB_CATEGORY_NAME : name, CATEGORY_ID : categoryId};
                        const subcategory = await SubCategoryDetails.create(updateJson);
                        output.msg = 'Successfully created subcategory';
                        status = 200;
                        logger.info(addRemoteIPToFileLogger(`Successfully created sub category ID : ${subcategory.SUB_CATEGORY_ID}`,request.location.ip,path,method));
                        const auditlog = await AuditLogs.create({ACTIONS : 'New Subcategory addition',FIELDS_AFFECTED : updateJson,RECORD_ID : subcategory.SUB_CATEGORY_ID,USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['SubCategory']});
                        logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                    }
                }
            }
            catch(err){
                output.msg = 'Error occurred while creating subcategory';
                logger.error(addRemoteIPToFileLogger(`Error occurred while adding sub category: ${err}`,request.location.ip,path,method));
            }
            return h.response(output).code(status);

        },
        config: {
            validate : {
                    payload : Joi.object(
                        {
                            'subcategory name' : Joi.string().min(4).max(25).required(),
                            categoryid : Joi.number().min(1).max(50).required()
                        }
                    ),
                    failAction : function (request,h , source, error) {
                        return h.response({ code: 400, message: source.details[0].message}).takeover().code(400);
                    }
            }
        }
    },
    {
        method : 'POST',
        path : '/addtocart',
        handler : async function(request,h){
            let path = '/addtocart',method = request.method;
            logger.info(addRemoteIPToFileLogger(`Inside POST addtocart request`,request.location.ip,path,method));
            let authHeader = request.headers['authorization'];
            if(authHeader == undefined){
                logger.warn((addRemoteIPToFileLogger(`Header value is missing in the request `,request.location.ip,path,method)));
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
            if(typeof resp != 'object'){
                logger.warn((addRemoteIPToFileLogger('Decoded value of the token isn\'t an object ',request.location.ip,path,method)));
                return h.response(resp).code(401);
            }
            let itemToAddToCart = request.payload,item_id = itemToAddToCart['itemid'],response = {},status = 500;

            const product = await ProductDetails.findOne({where : {PRODUCT_ID : item_id}});
            if(product == null){
                logger.info((addRemoteIPToFileLogger('Improper Product ID',request.location.ip,path,method)));
                response.msg = 'Improper Product ID';
                status = 400;
            }
            else{
                const cart = await CartDetails.findOne({where : {USER_ID : resp.user_id, PRODUCT_ID : product.PRODUCT_ID}});
                if(cart != null){
                    logger.info((addRemoteIPToFileLogger('Item Already in cart for the user',request.location.ip,path,method)));
                    response.msg = 'Item Already in cart for the user';
                    status = 200;
                }
                else{
                    const newcart = await CartDetails.create({USER_ID : resp.user_id, PRODUCT_ID : product.PRODUCT_ID});
                    logger.info((addRemoteIPToFileLogger(`Item added to cart successfully ID : ${newcart.CART_ITEM_ID}`,request.location.ip,path,method)));
                    response.msg = 'Item added to cart successfully';
                    status = 200;
                }
            }
            return h.response(response).code(status);
        },
        config: {
            validate : {
                    payload : Joi.object(
                        {
                            itemid: Joi.number().min(1).max(50).required()
                        }
                    ),
                    failAction : function (request,h , source, error) {
                        return h.response({ code: 400, message: source.details[0].message}).takeover().code(400);
                    }
            }
        }
    },
    {
        method : 'GET',
        path : '/getcart',
        handler : async function(request,h){
            let authHeader = request.headers['authorization'],path = '/getcart',method = request.method;
            logger.info(addRemoteIPToFileLogger(`Inside /getcart request`,request.location.ip,path,method));
            if(authHeader == undefined){
                logger.warn(addRemoteIPToFileLogger(`Header missing in the request`,request.location.ip,path,method));
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
            console.log('Received token :: ',token);
            console.log('Received response :: ',resp);
            if(typeof resp != 'object'){
                logger.warn(addRemoteIPToFileLogger(`Decoded value isn\'t an object`,request.location.ip,path,method));
                return h.response(resp).code(401);
            }
            // console.log('Response received : ',resp);
            // console.log('Username after decoding from token : ',resp['uname']);
            let obj={};
            try{
                let cartProducts = await CartDetails.findAll({where : {
                     USER_ID : resp.user_id
                    },
                    attributes: ['PRODUCT_ID']
                });
                //  console.log(`Data from DB :: ${JSON.stringify(cartProducts)} type :: ${typeof cartProducts}`);
                // let obj2 = Object.values(cartProducts);
                // console.log(`After extracting values alone :::: ${obj2} TYPE ::: ${typeof obj2}`);
                obj = cartProducts;
            }
            catch(err){
                console.log('Error occurred ');
                logger.error({message : `ERROR MESSAGE : ${err.message} ERROR STACK ::::::: ${err.stack}`});
                logger.error({message : `ERROR DETAILS : ${JSON.stringify(err.errors)}`});
                obj.message = 'An error occurred';
            }


                // let cartDetils = userCartDetails[uname],obj={};
                // obj.userCart = cartDetils;
                // logger.info(addRemoteIPToFileLogger(`Cart details of the user : ${JSON.stringify(cartDetils)}`,request.location.ip,path,method));
                // logs[uname] = loggingFunction.loggingTheActionToGlobalVariable('user accessing cart',request.location,logs[uname]);
                return h.response(obj).code(200);
        }
    },
    {
        method : 'POST',
        path : '/addproduct',
        handler : async function(request,h){
            let authHeader = request.headers['authorization'],path = '/addproduct',method = request.method,payload = request.payload;
            logger.info(addRemoteIPToFileLogger(`Inside the request`,request.location.ip,path,method));
            if(authHeader == undefined){
                logger.warn(addRemoteIPToFileLogger(`Header missing in the request`,request.location.ip,path,method));
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
            if(typeof resp != 'object'){
                logger.warn(addRemoteIPToFileLogger(`Decoded value isn\'t an object`,request.location.ip,path,method));
                return h.response(resp).code(401);
            }
            let output = {},status = 500,userId;
            console.log("asdfasdf    " ,resp);

            try{
                // const user = await User.findOne({where : { USER_ID : resp.user_id }});
                console.log('JWT Details ::: ',resp);
                const user = await redisClient.hGet('USER_DETAILS',String(resp.user_id));
                console.log('Redis Details ::: ',user);
                if(user == null ||user.IS_ADMIN == false){
                    output.msg = 'User isn\'t admin So unable to perform the action';
                    status = 401;
                }
                else{
                    const result = await SubCategoryDetails.findOne({where : { SUB_CATEGORY_ID : payload['subcategory'],CATEGORY_ID : payload['category'] }});
                    if(result == null){
                        output.msg = 'Mentioned category and subcategory id are improper';
                        status = 400;
                    }
                    else{
                        try{
                            let updateJson = {ITEM_NAME : payload['name'],ITEM_INFO : payload['basic'],CREATED_USER : resp.user_id},auditlog;
                            const baseitems = await BaseItems.create(updateJson);
                            console.log('Value of BaseItems :::: ',baseitems);
                            auditlog = await AuditLogs.create({ACTIONS : 'New BaseItem addition',FIELDS_AFFECTED : updateJson,RECORD_ID : baseitems.BASE_ITEM_ID,USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['BaseItems']});
                            logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                            let varieties = payload["varieties"];
                            varieties.forEach(async variety =>{
                                let item_price = variety['original price in rupees'],discount_price = variety['discounted price in rupees'],available_qty = variety['available quantities'];
                                delete variety['original price in rupees'];
                                delete variety['discounted price in rupees'];
                                delete variety['available quantities'];
                                output.msg = `Product successfully got created`;
                                status = 200;
                                updateJson = {ADDITONAL_INFO : variety, AVAILABLE_QUANTITY : available_qty, ORIGINAL_PRICE : item_price, DISCOUNTED_PRICE : discount_price,CREATED_USER : resp.user_id, BASE_ITEM_ID : baseitems.BASE_ITEM_ID,CATEGORY_ID : payload['category'], SUB_CATEGORY_ID : payload['subcategory'], IS_ACTIVE : true};
                                const product = await ProductDetails.create(updateJson);
                                logger.info(addRemoteIPToFileLogger(`Product successfully got created  ${product.PRODUCT_ID}`,request.location.ip,path,method));
                                auditlog = await AuditLogs.create({ACTIONS : 'New Product addition',FIELDS_AFFECTED : updateJson,RECORD_ID : product.PRODUCT_ID,USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['Product']});
                                logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                            })
                            let phraseToBeSearched = payload['name'];
                            for(const [key1,value1] of Object.entries(payload['basic'])){
                                for(let key2 in value1){
                                    phraseToBeSearched+= ' ';
                                    phraseToBeSearched+= value1[key2];
                                }
                            }
                            console.log('Phrase String :::: ',phraseToBeSearched);
                            let documentToPushToElastic = {
                                id : baseitems.BASE_ITEM_ID,
                                content : phraseToBeSearched
                            };
                            const result = await  insertDocumentsToELK('baseproductsearch',documentToPushToElastic);
                            /* ELK ARK 
                            const result = await elasticClient.index({
                                index: "baseproductsearch",
                                document: {
                                    id: baseitems.BASE_ITEM_ID,
                                    content: phraseToBeSearched,
                                },
                            });  */
                            console.log('Result after adding data to ELK :::: ',result);
                        }
                        catch(error){
                            logger.error(addRemoteIPToFileLogger(`Error occurred while creating Base Items ${error}`,request.location.ip,path,method));
                            output.msg = 'Error occurred while creating products';
                        }
                    }
                }
            }
            catch(err){
                output.msg = `Error occurred while creating products`;
                logger.error(addRemoteIPToFileLogger(`Error occurred while checking admin check : ${err}`,request.location.ip,path,method));
                logger.error({message : `ERROR MESSAGE : ${err.message} ERROR STACK ::::::: ${err.stack}`});
                logger.error({message : `ERROR DETAILS : ${JSON.stringify(err.errors)}`});
            }
            return h.response(output).code(status);
        },
        config : {
            validate : {
                payload : Joi.object(
                    {
                        name : Joi.string().min(3).max(20).required(),
                        basic : Joi.object().pattern(Joi.string().min(4).max(25).required(),Joi.object().pattern(Joi.string().min(3).max(25),Joi.string().min(4).max(100))).required(),
                        varieties : Joi.array().items(Joi.object({
                            'original price in rupees' : Joi.number().min(1).max(100000).required(),
                            'discounted price in rupees' : Joi.number().min(1).max(100000).required(),
                            'available quantities' : Joi.number().min(1).max(100000).required()
                        }).unknown(true)).required(),
                        category : Joi.number().min(1).max(50).required(),
                        subcategory :  Joi.number().min(1).max(500).required()
                    }
                ),
                failAction : function (request,h , source, error) {
                    let obj = [];
                    source.details.forEach(errorMsg => obj.push(errorMsg.message));
                    return h.response({ code: 400, message: obj}).takeover().code(400);
                }
            }
        }
    },
    {
        method : ['POST'],
        path : '/add/address',
        handler : async function(request,h){
            let status = 500,response = {};
            try{
                let authHeader = request.headers['authorization'],path = '/add/adddress',method = request.method;
                logger.info(addRemoteIPToFileLogger(`Inside the request`,request.location.ip,path,method));
                if(authHeader == undefined){
                    logger.warn(addRemoteIPToFileLogger(`Header missing in the request`,request.location.ip,path,method));
                    return h.response('Header missing in the request').code(401);
                }
                let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
                if(typeof resp != 'object'){
                    logger.warn(addRemoteIPToFileLogger(`Decoded value isn\'t an object`,request.location.ip,path,method));
                    return h.response(resp).code(401);
                }
                let userid = resp.user_id,payload = request.payload;

                // const user = await User.findOne({where : { USER_ID : userid}});
                const user = await redisClient.hGet('USER_DETAILS',String(resp.user_id));
                console.log('Redis Details ::: ',user);
                if(user == null){
                    response.msg = 'Improper user';
                    status = 400;
                }
                else{
                    let updateJson = {FLAT_NO : payload['flat no'], FLAT_NAME : payload['flat name'],STREET : payload.street,CITY : payload.city,STATE : payload.state,PINCODE : payload.pincode, USER_ID : userid};
                    updateJson.ADDRESS_TYPE = payload["address type"] == "work" ? 0 : 1;
                    const address = await Address.create(updateJson);
                    logger.info(addRemoteIPToFileLogger(`Address ID : ${address.ADDRESS_ID} added successfully`,request.location.ip,path,method));
                    let auditlog =  await AuditLogs.create({ACTIONS : 'New Address addition',FIELDS_AFFECTED : updateJson,RECORD_ID : address.ADDRESS_ID,USER_ID : userid,MODULE_ID : moduleWithIdDetails['User']});
                    logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                    response.msg = 'Address has been added successfully';
                    status = 200;
                }
            }
            catch(error){
                response.msg = 'Error occurred while adding address';
                logger.error(addRemoteIPToFileLogger(`Error occurred while adding address ${error}`,request.location.ip,'/add/address',request.method));
            }
            return h.response(response).code(200);
        },
        config : {
            validate : {
                payload : Joi.object(
                    {
                        'flat no' : Joi.number().min(1).max(32000).required(),
                        'flat name' : Joi.string().min(3).max(30),
                        street : Joi.string().min(3).max(20).required(),
                        city : Joi.string().min(3).max(20).required(),
                        state : Joi.string().min(3).max(20).required(),
                        pincode : Joi.string().min(6).max(6).required(),
                        'address type' : Joi.string().valid('home','work').required()
                    }
                ),
                failAction : function (request,h , source, error) {
                    let obj = [];
                    source.details.forEach(errorMsg => obj.push(errorMsg.message));
                    return h.response({ code: 400, message: obj}).takeover().code(400);
                }
            }
        }
    },
    {
        method : ['GET'],
        path : '/getaddresses',
        handler : async function(request,h){
            let status = 500,response = {};
            try{
                let authHeader = request.headers['authorization'],path = '/getaddresses',method = request.method;
                logger.info(addRemoteIPToFileLogger(`Inside the request`,request.location.ip,path,method));
                if(authHeader == undefined){
                    logger.warn(addRemoteIPToFileLogger(`Header missing in the request`,request.location.ip,path,method));
                    return h.response('Header missing in the request').code(401);
                }
                let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
                if(typeof resp != 'object'){
                    logger.warn(addRemoteIPToFileLogger(`Decoded value isn\'t an object`,request.location.ip,path,method));
                    return h.response(resp).code(401);
                }
                let userid = resp.user_id;

                // const user = await User.findOne({where : { USER_ID : userid}});
                const addresses = await Address.findAll({where : {USER_ID : resp.user_id}});
                console.log(`USER FROM DB ::: ${addresses} type ::: ${typeof addresses}`);
                let response = {};
                if(addresses.length > 0){
                    response = addresses;
                }
                else{
                    response.msg = 'No address found';
                }
                return h.response(response).code(200);
            }
            catch(error){
                response.msg = 'Error occurred while getting address';
                logger.error(addRemoteIPToFileLogger(`Error occurred while getting address ${error}`,request.location.ip,'/getaddresses',request.method));
                logger.error({message : `ERROR MESSAGE : ${error.message} ERROR STACK ::::::: ${error.stack}`});
                logger.error({message : `ERROR DETAILS : ${JSON.stringify(error.errors)}`});
            }
            return h.response(response).code(200);
        }
    },
    {
        method : ['GET'],
        path : '/userdetails',
        handler : async function(request,h){
            let status = 500,response = {};
            try{
                let authHeader = request.headers['authorization'],path = '/getaddresses',method = request.method;
                logger.info(addRemoteIPToFileLogger(`Inside the request`,request.location.ip,path,method));
                if(authHeader == undefined){
                    logger.warn(addRemoteIPToFileLogger(`Header missing in the request`,request.location.ip,path,method));
                    return h.response('Header missing in the request').code(401);
                }
                let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
                if(typeof resp != 'object'){
                    logger.warn(addRemoteIPToFileLogger(`Decoded value isn\'t an object`,request.location.ip,path,method));
                    return h.response(resp).code(401);
                }
                let userid = resp.user_id;

                // const user = await User.findOne({where : { USER_ID : userid}});
                // const addresses = await Address.findAll({where : {USER_ID : resp.user_id}});
                const userDetails = await User.findAll({
                    where : {
                        USER_ID : resp.user_id
                    },
                    attributes: [["FIRST_NAME",'firstname'], ["LAST_NAME",'lastname'],["EMAIL",'email'],["PHONE",'phone']],
                    include : [
                        {
                            model : Address,
                            attributes: [["ADDRESS_ID",'aid'], ["FLAT_NO",'flatno'],["FLAT_NAME",'flatname'],["STREET",'street'],["CITY",'city'],["STATE",'state'],["PINCODE",'pincode']],
                        }
                    ]
                });
                console.log(`USER FROM DB ::: ${userDetails} type ::: ${typeof userDetails}`);
                let response = {};
                if(userDetails.length > 0){
                    response = userDetails;
                }
                else{
                    response.msg = 'User Details not found';
                }
                return h.response(response).code(200);
            }
            catch(error){
                response.msg = 'Error occurred while getting address';
                logger.error(addRemoteIPToFileLogger(`Error occurred while getting address ${error}`,request.location.ip,'/getaddresses',request.method));
                logger.error({message : `ERROR MESSAGE : ${error.message} ERROR STACK ::::::: ${error.stack}`});
                logger.error({message : `ERROR DETAILS : ${JSON.stringify(error.errors)}`});
            }
            return h.response(response).code(200);
        }
    },
    {
        method : ['PUT'],
        path : '/edit/address',
        handler : async function(request,h){
            let status = 500,response = {};
            try{
                let authHeader = request.headers['authorization'],path = '/edit/adddress',method = request.method;
                logger.info(addRemoteIPToFileLogger(`Inside the request`,request.location.ip,path,method));
                if(authHeader == undefined){
                    logger.warn(addRemoteIPToFileLogger(`Header missing in the request`,request.location.ip,path,method));
                    return h.response('Header missing in the request').code(401);
                }
                let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
                if(typeof resp != 'object'){
                    logger.warn(addRemoteIPToFileLogger(`Decoded value isn\'t an object`,request.location.ip,path,method));
                    return h.response(resp).code(401);
                }
                let userid = resp.user_id,payload = request.payload,address_id = payload['address id'];
                // const user = await User.findOne({where : { USER_ID : userid}});
                const user = await redisClient.hGet('USER_DETAILS',String(resp.user_id));
                // logger.log({message : `Redis Details ::: ${JSON.stringify(user)}`});
                logger.info(addRemoteIPToFileLogger(`Redis Details ::: ${JSON.stringify(user)}`,request.location.ip,path,method));
                const address  = await Address.findOne({where : {USER_ID : userid,ADDRESS_ID : address_id}})
                if(user == null){
                    response.msg = 'Improper user';
                    status = 400;
                }
                else if(address == null){
                    response.msg = 'Improper address';
                    status = 400;
                }
                else{
                    let updateJson = {};
                    const reqKeysWithServerKeys = {'flat no' : 'FLAT_NO','flat name' : 'FLAT_NAME','address type' : 'ADDRESS_TYPE','street' : 'STREET','city' : 'CITY','state' : 'STATE','pincode' : 'PINCODE'};
                    for(let [key,value] of Object.entries(payload)){
                        if(key == 'address id'){
                            continue;
                        }
                        if(key == "address type"){
                            value = (value == "work") ? 0 : 1;
                        }
                        updateJson[reqKeysWithServerKeys[key]] = value;
                    }
                    console.log(updateJson);
                    const address = await Address.update(updateJson,{where : {ADDRESS_ID : address_id}});
                    console.log(address);
                    logger.info(addRemoteIPToFileLogger(`Address ID : ${address.ADDRESS_ID} updated successfully`,request.location.ip,path,method));
                    let auditlog =  await AuditLogs.create({ACTIONS : 'Address updation',FIELDS_AFFECTED : updateJson,RECORD_ID : address_id,USER_ID : userid,MODULE_ID : moduleWithIdDetails['User']});
                    logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                    response.msg = 'Address has been updated successfully';
                    status = 200;
                }
            }
            catch(error){
                response.msg = 'Error occurred while updating address';
                logger.error(addRemoteIPToFileLogger(`Error occurred while updating address ${error}`,request.location.ip,'/edit/address',request.method));
            }
            return h.response(response).code(200);
        },
        config : {
            validate : {
                payload : Joi.object(
                    {
                        'flat no' : Joi.number().min(1).max(32000),
                        'flat name' : Joi.string().min(3).max(30),
                        street : Joi.string().min(3).max(20),
                        city : Joi.string().min(3).max(20),
                        state : Joi.string().min(3).max(20),
                        pincode : Joi.string().min(6).max(6),
                        'address type' : Joi.string().valid('home','work'),
                        'address id' : Joi.number().min(1).max(500).required()
                    }
                ),
                failAction : function (request,h , source, error) {
                    let obj = [];
                    source.details.forEach(errorMsg => obj.push(errorMsg.message));
                    return h.response({ code: 400, message: obj}).takeover().code(400);
                }
            }
        }
    },
    {
        method : 'DELETE',
        path : '/products/delete',
        handler : async function(request,h){
            let authHeader = request.headers['authorization'],path = '/products/delete',method = request.method,item_id = request.query['id'];
            logger.info(addRemoteIPToFileLogger(`Inside the request`,request.location.ip,path,method));
            if(authHeader == undefined){
                logger.warn(addRemoteIPToFileLogger(`Header missing in the request`,request.location.ip,path,method));
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
            if(typeof resp != 'object'){
                logger.warn(addRemoteIPToFileLogger(`Decoded value isn\'t an object`,request.location.ip,path,method));
                return h.response(resp).code(401);
            }

            const user = await User.findOne({where : { USER_ID : resp.user_id}});
            let status = 500,response = {};
            if(user == null){
                response.msg = 'Improper user';
                status = 400;
            }
            else if(user.IS_ADMIN == false){
                response.msg = 'User not a Admin';
                status = 401;
            }
            else{
                const productPresent = await ProductDetails.findOne({where :{PRODUCT_ID :item_id}});
                if(productPresent == null){
                    response.msg = 'Improper product id being passed';
                    status = 400;
                }
                else{
                    let updateJson = {IS_ACTIVE : false};
                    const product = await ProductDetails.update(updateJson, {where : {PRODUCT_ID : item_id}});
                    logger.info(addRemoteIPToFileLogger(`Product ID : ${item_id} has been made inactive successfully `,request.location.ip,path,method));
                    let auditlog =  await AuditLogs.create({ACTIONS : 'Made product inactive',FIELDS_AFFECTED : updateJson,RECORD_ID : item_id,USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['Product']});
                    logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                    response.msg = 'Product has been removed successfully';
                    status = 200;
                }
            }
            return h.response(response).code(status);
        }
    },
    {
        method : ['PUT','POST'],
        path : '/products/edit',
        handler : async function(request,h){
            let authHeader = request.headers['authorization'],path = '/addproduct',method = request.method,payload = request.payload,status = 500,response = {};
            try{
                logger.info(addRemoteIPToFileLogger(`Inside the request`,request.location.ip,path,method));
                if(authHeader == undefined){
                    logger.warn(addRemoteIPToFileLogger(`Header missing in the request`,request.location.ip,path,method));
                    return h.response('Header missing in the request').code(401);
                }
                let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
                if(typeof resp != 'object'){
                    logger.warn(addRemoteIPToFileLogger(`Decoded value isn\'t an object`,request.location.ip,path,method));
                    return h.response(resp).code(401);
                }

                const user = await User.findOne({where : { USER_ID : resp.user_id}});
                if(user == null){
                    response.msg = 'Improper user';
                    status = 400;
                }
                else if(user.IS_ADMIN == false){
                    response.msg = 'User not a Admin';
                    status = 401;
                }
                else{
                    const productPresent = await ProductDetails.findOne({where :{PRODUCT_ID :payload['product id']}});
                    if(productPresent == null){
                        response.msg = 'Improper product id being passed';
                        status = 400;
                    }
                    else{
                        let updateJson = {},quantity = productPresent.AVAILABLE_QUANTITY;
                        if(payload['quantities to add'] != null){
                            quantity += payload['quantities to add'];
                        }
                        const reqKeysWithServerKeys = {'original price in rupees' : 'ORIGINAL_PRICE','discounted price in rupees' : 'DISCOUNTED_PRICE','quantities to add' : 'AVAILABLE_QUANTITY'};
                        for(let [key,value] of Object.entries(payload)){
                            if(key == 'product id'){
                                continue;
                            }
                            if(key == 'quantities to add'){
                                value = quantity;
                            }
                            updateJson[reqKeysWithServerKeys[key]] = value;
                        }
                        const product = await ProductDetails.update(updateJson, {where : {PRODUCT_ID :payload['product id'] }});
                        logger.info(addRemoteIPToFileLogger(`Product ID : ${payload['product id']} has been made updated successfully `,request.location.ip,path,method));
                        let auditlog =  await AuditLogs.create({ACTIONS : 'Product update',FIELDS_AFFECTED : updateJson,RECORD_ID : payload['product id'],USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['Product']});
                        logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                        response.msg = 'Product has been updated successfully';
                        status = 200;
                    }
                }
            }
            catch(error){
                response.msg = 'Error occurred while updating product ';
                logger.error(addRemoteIPToFileLogger(`Error occurred while updating product ${error}`,request.location.ip,path,method));
            }
            return h.response(response).code(status);
        },
        config : {
            validate : {
                payload : Joi.object(
                    {
                        'product id' : Joi.number().min(1).max(50).required(),
                        'original price in rupees' : Joi.number().min(1).max(100000),
                        'discounted price in rupees' : Joi.number().min(1).max(100000),
                        'quantities to add' : Joi.number().min(1).max(100000)
                    }
                ),
                failAction : function (request,h , source, error) {
                    let obj = [];
                    source.details.forEach(errorMsg => obj.push(errorMsg.message));
                    return h.response({ code: 400, message: obj}).takeover().code(400);
                }
            }
        }
    },
    {
        method : 'POST',
        path : '/getcart/buy',
        handler : async function(request,h){
            let authHeader = request.headers['authorization'],path = '/getcart/buy',method = request.method;
            logger.info(addRemoteIPToFileLogger(`Inside the request`,request.location.ip,path,method));
            if(authHeader == undefined){
                logger.warn(addRemoteIPToFileLogger(`Header missing in the request`,request.location.ip,path,method));
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
            if(typeof resp != 'object'){
                logger.warn(addRemoteIPToFileLogger(`Decoded value isn\'t an object`,request.location.ip,path,method));
                return h.response(resp).code(401);
            }
            let payload = request.payload,itemsAndQuantities = payload['items'],address_fromreq = payload["delivery address id"],source = payload['payment source'], response = {},status = 500;

            const address = await Address.findOne({where : {USER_ID : resp.user_id,ADDRESS_ID : address_fromreq }});
            if(address == null){ 
                logger.error(addRemoteIPToFileLogger('Improper Delivery Address provided',request.location.ip,path,method));
                response.msg = 'Improper Delivery Address provided';
                status = 400; 
            }
            else{
                if(Object.keys(itemsAndQuantities).length <= 0 ){
                    logger.error(addRemoteIPToFileLogger(`Provided length of items is less than equal to zero`,request.location.ip,path,method));
                    response.msg = 'Provided length of items is less than equal to zero';
                    status = 400; 
                }
                else{
                    let invalidProducts = [],totalPrice = 0,prodWithPrice = {};
                    for(const [key,value] of Object.entries(itemsAndQuantities)){
                        let product_id = Number(key);
                        const product = await ProductDetails.findOne({where : {PRODUCT_ID : product_id}});
                        if(product == null){
                            invalidProducts.push(key);
                        }
                        else{
                            let price = product.DISCOUNTED_PRICE,available_qty = product.AVAILABLE_QUANTITY;
                            if(available_qty <= 0){
                                invalidProducts.push(key);
                            }
                            else{
                                if(available_qty < value){
                                    value = available_qty;
                                    itemsAndQuantities[key] = value;
                                }
                                totalPrice += (price * value);
                                const baseItems= await BaseItems.findOne({where : {BASE_ITEM_ID : product.BASE_ITEM_ID}});
                                let obj = {};
                                obj.availQty = available_qty;
                                obj.price = price;
                                obj.item_name = baseItems.ITEM_NAME;
                                prodWithPrice[key] = obj;
                            }
                        }
                    }
                    response['Invalid Product ID\'s '] = invalidProducts;
                    let numberOfItemsBrought = Object.keys(prodWithPrice).length;
                    let updateJson = {TOTAL_ITEMS_BROUGHT : numberOfItemsBrought,TOTAL_AMOUNT : totalPrice,PAYMENT_SOURCE : source,BROUGHT_BY : resp.user_id,DELIVERY_ADDRESS : address.ADDRESS_ID,STATUS : 0},auditlog;
                    const invoice = await Invoice.create(updateJson);
                    logger.info(addRemoteIPToFileLogger(`Invoice created successfully ID : ${invoice.INVOICE_ID}`,request.location.ip,path,method));
                    auditlog = await AuditLogs.create({ACTIONS : 'New Invoice addition',FIELDS_AFFECTED : updateJson,RECORD_ID : invoice.INVOICE_ID,USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['Invoices']});
                    logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                    try{
                        let invoiceLineItemsObj = [];
                        for(const [key,value] of Object.entries(prodWithPrice)){
                            let lineItemObj = {};
                            let id = Number(key);
                            updateJson = {QUANTITY : itemsAndQuantities[key], ITEM_PRICE :value.price ,TOTAL_PRICE : itemsAndQuantities[key] * value.price, INVOICE_ID : invoice.INVOICE_ID,PRODUCT_ID : id};
                            let invoice_line_items =  await InvoiceLineItems.create( updateJson);
                            logger.info(addRemoteIPToFileLogger(`Invoice line items has been created successfully ID : ${invoice_line_items.INVOICE_LINE_ITEM_ID}`,request.location.ip,path,method));
                            updateJson2 = {AVAILABLE_QUANTITY : value.availQty - itemsAndQuantities[key]};
                            let prodUpdate = await ProductDetails.update(
                                updateJson2,
                                {
                                    where : {
                                        PRODUCT_ID : id
                                    }
                                }
                            );
                            lineItemObj['item name'] = value.item_name;
                            lineItemObj['qty'] = itemsAndQuantities[key];
                            lineItemObj['price'] = value.price;
                            lineItemObj['total'] = itemsAndQuantities[key] * value.price;
                            invoiceLineItemsObj.push(lineItemObj);
                            logger.info(addRemoteIPToFileLogger(`Available quantity has been reduced successfully for product id : ${id} `,request.location.ip,path,method));

                            auditlog =  await AuditLogs.create({ACTIONS : 'New Invoice Lineitem addition',FIELDS_AFFECTED : updateJson,RECORD_ID : invoice_line_items.INVOICE_LINE_ITEM_ID,USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['InvoiceLineItems']});
                            logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));

                            auditlog =  await AuditLogs.create({ACTIONS : 'Product Available quantity reduction',FIELDS_AFFECTED : updateJson2,RECORD_ID : id,USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['Product']});
                            logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                        }
                        // const user = await User.findOne({where : { USER_ID : resp.user_id}});
                        const user = await redisClient.hGet('USER_DETAILS',String(resp.user_id));
                        console.log('Redis Details ::: ',user);
                        // if(user == null){
                        let payMethod = (invoice.PAYMENT_SOURCE == 0) ? 'Credit Card' : (invoice.PAYMENT_SOURCE == 1) ? 'Debit Card' : (invoice.PAYMENT_SOURCE == 2) ? 'UPI' : 'Wallet';
                        let jobDetails  = {
                            email : user.EMAIL,
                            username : user.FIRST_NAME,
                            invoice : {
                                total_items : invoice.TOTAL_ITEMS_BROUGHT,
                                total_amount : invoice.TOTAL_AMOUNT,
                                payment_method : payMethod,
                                orderedDate : invoice.ORDERED_TIME
                            },
                            invoice_line_items : invoiceLineItemsObj
                        };
                        let jobName = 'InvoiceToProcess_'+invoice.INVOICE_ID;
                        await invoiceSendQueue.add(jobName,jobDetails,{
                            removeOnComplete : true,
                            removeOnFail: {
                                age: 24 * 3600
                            }
                        });
                        logger.info(addRemoteIPToFileLogger(`Job name : ${jobName} has been added to queue : invoiceSendQueue`,request.location.ip,path,method));
                        response.msg = 'Invoice has been created successfully';
                        status = 200;
                    }
                    catch(err){
                        logger.error(addRemoteIPToFileLogger(`Error occurred: ${err}`,request.location.ip,path,method));
                        response.msg = 'Error occurred while creating products';
                    }

                }
            }

            return h.response(response).code(200);
        },
        config : {
            validate : {
                payload : Joi.object(
                    {
                        items : Joi.object().pattern(Joi.string().min(1).max(2), Joi.number().min(1).max(4)).required(),
                        'payment source' : Joi.number().min(0).max(3).required(),
                        'delivery address id' :  Joi.number().min(1).max(50).required()
                    }
                ),
                failAction : function (request,h , source, error) {
                    let obj = [];
                    source.details.forEach(errorMsg => obj.push(errorMsg.message));
                    return h.response({ code: 400, message: obj}).takeover().code(400);
                    
                }
            }
        }
    },
    {
        method : 'POST',
        path : '/buy',
        handler : async function(request,h){
            let authHeader = request.headers['authorization'],path = '/buy',method = request.method;
            logger.info(addRemoteIPToFileLogger(`Inside /buy request`,request.location.ip,path,method));
            if(authHeader == undefined){
                logger.warn(addRemoteIPToFileLogger(`Header missing in the request`,request.location.ip,path,method));
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
            if(typeof resp != 'object'){
                logger.warn(addRemoteIPToFileLogger(`Decoded value isn\'t an object`,request.location.ip,path,method));
                return h.response(resp).code(401);
            }
            let userid = resp.user_id,payload = request.payload,product_id = payload['product id'],quantity = payload['quantity'],source = payload['payment source'],address_fromreq = payload['delivery address id'],response = {},status = 500;


            const product = await ProductDetails.findOne({where : {PRODUCT_ID : product_id,IS_ACTIVE : true}});
            if(product == null){
                logger.error(addRemoteIPToFileLogger(`Mentioned product id is improper`,request.location.ip,path,method));
                response.msg = 'Mentioned product id is improper';
                status = 400; 
            }
            else if(product.AVAILABLE_QUANTITY == 0){
                logger.warn(addRemoteIPToFileLogger(`Mentioned product id is currently Out Of Stock`,request.location.ip,path,method));
                response.msg = 'Mentioned product id is currently Out Of Stock';
                status = 200; 
            }
            else{
                if(product.AVAILABLE_QUANTITY < quantity){
                    quantity = product.AVAILABLE_QUANTITY;
                }
                const address = await Address.findOne({where : {USER_ID : userid,ADDRESS_ID : address_fromreq }});
                if(address == null){ 
                    logger.error(addRemoteIPToFileLogger(`Improper Delivery Address provided`,request.location.ip,path,method));
                    response.msg = 'Improper Delivery Address provided';
                    status = 400; 
                }
                else{
                    let updateJson = {TOTAL_ITEMS_BROUGHT : 1,TOTAL_AMOUNT : quantity * product.DISCOUNTED_PRICE,PAYMENT_SOURCE : source,BROUGHT_BY : userid,DELIVERY_ADDRESS : address.ADDRESS_ID,STATUS : 0},auditlog;
                    const invoice = await Invoice.create(updateJson);
                    logger.info(addRemoteIPToFileLogger(`Invoice created successfully ID : ${invoice.INVOICE_ID}`,request.location.ip,path,method));
                    auditlog = await AuditLogs.create({ACTIONS : 'New Invoice addition',FIELDS_AFFECTED : updateJson,RECORD_ID : invoice.INVOICE_ID,USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['Invoices']});
                    logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                    let invoice_line_items;
                    try{
                        updateJson = {QUANTITY : quantity, ITEM_PRICE :product.DISCOUNTED_PRICE ,TOTAL_PRICE : invoice.TOTAL_AMOUNT, INVOICE_ID : invoice.INVOICE_ID,PRODUCT_ID : product.PRODUCT_ID};
                        invoice_line_items =  await InvoiceLineItems.create(updateJson);
                        logger.info(addRemoteIPToFileLogger(`Invoice line items has been created successfully ID : ${invoice_line_items.INVOICE_LINE_ITEM_ID}`,request.location.ip,path,method));
                        let updateJson2 = {AVAILABLE_QUANTITY : product.AVAILABLE_QUANTITY - quantity };
                        let prodUpdate = await ProductDetails.update(
                            updateJson2,
                            {
                                where : {
                                    PRODUCT_ID : product.PRODUCT_ID
                                }
                            }
                        );
                        logger.info(addRemoteIPToFileLogger(`Available quantity has been reduced successfully for product id : ${prodUpdate.PRODUCT_ID} `,request.location.ip,path,method));
                        auditlog =  await AuditLogs.create({ACTIONS : 'New Invoice Lineitem addition',FIELDS_AFFECTED : updateJson,RECORD_ID : invoice_line_items.INVOICE_LINE_ITEM_ID,USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['InvoiceLineItems']});
                        logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                        auditlog =  await AuditLogs.create({ACTIONS : 'Product Available quantity reduction',FIELDS_AFFECTED : updateJson2,RECORD_ID : product.PRODUCT_ID,USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['Product']});
                        logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                        response.msg = 'Invoice has been created successfully';
                        status = 200;
                    }
                    catch(err){
                        response.msg = 'Unable to order item at this moment';
                        logger.error(addRemoteIPToFileLogger(`Error occurred: ${err}`,request.location.ip,path,method));
                    }
                    
                }
            }
            return h.response(response).code(status);
        },
        config : {
            validate : {
                payload : Joi.object(
                    {
                        'product id' :  Joi.number().min(1).max(500).required(),
                        quantity : Joi.number().min(1).max(4).required(),
                        'payment source' : Joi.number().min(0).max(3).required(),
                        'delivery address id' :  Joi.number().min(1).max(50).required()
                    }
                ),
                failAction : function (request,h , source, error) {
                    let obj = [];
                    source.details.forEach(errorMsg => obj.push(errorMsg.message));
                    return h.response({ code: 400, message: obj}).takeover().code(400);
                    // return h.response({ code: 400, message: source.details[0].message}).takeover().code(400);
                    
                }
            }
        }
    },
    {
        method : 'GET',
        path : '/getordereditems',
        handler : async function(request,h){
            let authHeader = request.headers['authorization'],path = '/getordereditems',method = request.method,invoicess = {}, from = request.query['offset'], fromRange = ( from != null && !isNaN(Number(from)))  ? from : 0,status = 500;
            console.log('Type of offset :::::: ',typeof from);
            try{
            logger.info(addRemoteIPToFileLogger(`Inside /getordereditems request`,request.location.ip,path,method));
            if(authHeader == undefined){
                logger.warn(addRemoteIPToFileLogger(`Header missing in the request`,request.location.ip,path,method));
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
            if(typeof resp != 'object'){
                logger.warn(addRemoteIPToFileLogger(`Decoded value isn\'t an object`,request.location.ip,path,method));
                return h.response(resp).code(401);
            }
            // console.log('Response received : ',resp);
            // console.log('Username after decoding from token : ',resp['uname']);  on : {'Invoice.INVOICE_ID' : 'InvoiceLineItems.INVOICE_ID'},

            invoicess = await Invoice.findAll({
                where : {
                    BROUGHT_BY : resp.user_id
                },
                include : [{
                  model: InvoiceLineItems,
                  required : true
                }],
                order : [['INVOICE_ID','DESC']],
                offset : fromRange,
                limit : 5
                }
              );
            status = 200;
            if(Object.keys(invoicess).length == 0){
                invoicess.msg = 'No orders found ';
                logger.info(addRemoteIPToFileLogger(`No orders are being placed for the user ${resp.user_id}`,request.location.ip,path,method));
            }
            logger.error(addRemoteIPToFileLogger(`Successfully queried and got the results ::: ${invoicess}`,request.location.ip,path,method));
            // else if(invoicess.length == 0){
            //     invoicess.msg = 'No invoices found 2';
            //     logger.info(addRemoteIPToFileLogger(`No orders are being placed for the 22 user ${resp.user_id}`,request.location.ip,path,method));
            // }
            // console.log('Value of invoices is :::::::: ',Object.keys(invoicess).length );

            // let invoiceWithLineItems = await InvoiceLineItems.findAll({
            //     include: {
            //       model: Invoice,
            //       where : {
            //         BROUGHT_BY : resp.user_id
            //       },
            //       required: true
            //     },
            //     group: [InvoiceLineItems.INVOICE_ID]
            //   });
            }
            catch(err){
                invoicess.msg = 'An error has occurred while getting the invoice details';
                logger.error(addRemoteIPToFileLogger(`Error Details ::: ${err}`,request.location.ip,path,method));
            }


            // let uname = resp['uname'];
            // if(userOrderedItems[uname] == undefined){
            //     userOrderedItems[uname] = [];
            // }
            // logger.info(addRemoteIPToFileLogger(`Successfully responded with the ordered details to the user ${JSON.stringify(userOrderedItems[uname])}`,request.location.ip,path,method));
            console.log('Length of invoices :::: ',invoicess);
            return h.response(invoicess).code(status);
        }
    },
    {
        method : 'GET',
        path : '/findmyipaddress',
        handler : function(request,h){
            console.log('Finding ip related details using plugin : ', request.location);
            const queryparams = request.query;
            let uname = queryparams['username'];
            if(uname == undefined || uname == ''){
                return h.response('Username param in query is mandatory for finding the IP Address').code(400);
            }
            // let loggerObj = loggingFunction.createLoggerObjForCurrentAction('User requested to find his IP Address',request.location);
            // let logsArrayOfUser = loggingFunction.loggingTheActionToGlobalVariable('User requested to find his IP Address',request.location,logs[uname]);
            // let userlogs = logs[queryparams['username']];
            // if(userlogs == undefined){
            //     userlogs  = [];          
            // }
            // userlogs.push(loggerObj);
            logs[uname] = loggingFunction.loggingTheActionToGlobalVariable('User requested to find his IP Address',request.location,logs[uname]);
            // console.log('complete logs : ',logs);
            console.log('User log details : ',logs[uname]);
            return h.response(request.location).code(200);
        }
    },
    {
        method : 'GET',
        path : '/clientsearch',
        handler : async function(request,h){
            let authHeader = request.headers['authorization'],method = 'GET',path ='/userlogs', resultJSON = [],response = {},status = 500;
            try{
                if(authHeader == undefined){
                    return h.response('Header missing in the request').code(401);
                }
                let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
                if(typeof resp != 'object'){
                    return h.response(resp).code(401);
                }
                let searchterm = request.query['searchword'];
                console.log('SEARCH :: ',searchterm);
                let searchProductIDs = [];
                if(searchterm != '' && searchterm != undefined){
                    let fieldsAndValueToSearch = {
                        fieldName : 'content',
                        searchterm : searchterm
                    }
                    const result = await searchForText('baseproductsearch',fieldsAndValueToSearch);
                    /* ELK ARK
                    const result = await elasticClient.search({
                        index: "baseproductsearch",
                        "query": {
                            "query_string" : {"default_field" : "content", "query" : searchterm}
                        },
                    });
                    */
                    console.log('ELK SEARCH RESULT :::: ',result);
                    for(const [key,value] of Object.entries(result.hits.hits)){
                        // const baseItemDetails = await BaseItems.findOne({where : {BASE_ITEM_ID : value['_source'].id}});
                        // let productDetails = {};
                        // productDetails["Item Name"] = baseItemDetails.ITEM_NAME;
                        // productDetails["Item Info"] = baseItemDetails.ITEM_INFO;
                        const products = await ProductDetails.findAll({
                                where : {
                                    BASE_ITEM_ID : value['_source'].id
                                },
                                attributes: ['PRODUCT_ID']
                            });
                        console.log(`RES :: ${products} TYPE :: ${typeof products}`);
    
                        // ,
                        // include : [{
                        //     model : BaseItems,
                        //     required: true
                        // }]
    
                        for(const [key,value] of Object.entries(products)){
                            console.log('KEy :: ',key,'value PRODUCT IDs :: ',value.dataValues.PRODUCT_ID);
                            searchProductIDs.push(value.dataValues.PRODUCT_ID);
                            // const individualProductDetails = value.dataValues;
                            // // console.log('ABCD ::: ',individualProductDetails);
                            // let itemDetails = {};
                            // itemDetails["Item Name"] = baseItemDetails.ITEM_NAME;
                            // itemDetails["Item Info"] = Object.assign({},baseItemDetails.ITEM_INFO,individualProductDetails.ADDITONAL_INFO);
                            // itemDetails["Original Price"] = individualProductDetails.ORIGINAL_PRICE;
                            // itemDetails["Discounted Price"] = individualProductDetails.DISCOUNTED_PRICE;
                            // resultJSON.push(itemDetails);
                            // console.log('-------');
                            // // console.log('Product VAL ::: ',value);
                            // console.log('value dataValues ::: ',value.dataValues);
                            // console.log('-------');
                        }
                    }
                }
                response.msg = searchProductIDs.length > 0 ? searchProductIDs : 'No matching records found';
                status = 200;
            }
            catch(err){
                response.msg = 'Error occurred while getting data from ELK';
                status = 500;
                logger.error({message : `ERROR MESSAGE : ${err.message} ERROR STACK ::::::: ${err.stack}`});
                logger.error({message : `ERROR DETAILS : ${JSON.stringify(err.errors)}`});
            }

            return h.response(response).code(200);
        }
    },
    {
        method : 'GET',
        path : '/search',
        handler : async function(request,h){
            let authHeader = request.headers['authorization'],method = 'GET',path ='/userlogs', resultJSON = [],response = {},status = 500;
            try{
                if(authHeader == undefined){
                    return h.response('Header missing in the request').code(401);
                }
                let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
                if(typeof resp != 'object'){
                    return h.response(resp).code(401);
                }
                let searchterm = request.query['searchword'];
                console.log('SEARCH :: ',searchterm);
                if(searchterm != '' && searchterm != undefined){
                    let fieldsAndValueToSearch = {
                        fieldName : 'content',
                        searchterm : searchterm
                    };
                    const result = await searchForText('baseproductsearch',fieldsAndValueToSearch);
                    console.log('Result after adding data to ELK :::: ',result);

                    // const result = await elasticClient.search({
                    //     index: "baseproductsearch",
                    //     "query": {
                    //         "query_string" : {"default_field" : "content", "query" : searchterm}
                    //     },
                    // });

                    for(const [key,value] of Object.entries(result.hits.hits)){
                        const baseItemDetails = await BaseItems.findOne({where : {BASE_ITEM_ID : value['_source'].id}});
                        // let productDetails = {};
                        // productDetails["Item Name"] = baseItemDetails.ITEM_NAME;
                        // productDetails["Item Info"] = baseItemDetails.ITEM_INFO;
                        const products = await ProductDetails.findAll({where : {BASE_ITEM_ID : value['_source'].id}});
    
                        // ,
                        // include : [{
                        //     model : BaseItems,
                        //     required: true
                        // }]
    
                        for(const [key,value] of Object.entries(products)){
                            const individualProductDetails = value.dataValues;
                            // console.log('ABCD ::: ',individualProductDetails);
                            let itemDetails = {};
                            itemDetails["Item Name"] = baseItemDetails.ITEM_NAME;
                            itemDetails["Item Info"] = Object.assign({},baseItemDetails.ITEM_INFO,individualProductDetails.ADDITONAL_INFO);
                            itemDetails["Original Price"] = individualProductDetails.ORIGINAL_PRICE;
                            itemDetails["Discounted Price"] = individualProductDetails.DISCOUNTED_PRICE;
                            resultJSON.push(itemDetails);
                            console.log('-------');
                            // console.log('Product VAL ::: ',value);
                            console.log('value dataValues ::: ',value.dataValues);
                            console.log('-------');
                        }
                    }
                }
                response.msg = resultJSON.length > 0 ? resultJSON : 'No matching records found';
                status = 200;
            }
            catch(err){
                response.msg = 'Error occurred while getting data from ELK';
                status = 500;
                logger.error({message : `ERROR MESSAGE : ${err.message} ERROR STACK ::::::: ${err.stack}`});
                logger.error({message : `ERROR DETAILS : ${JSON.stringify(err.errors)}`});
            }

            return h.response(response).code(200);
        }
    },
    {
        method : 'GET',
        path : '/userlogs',
        handler : async function(request,h){
            let response = {}, status = 500;
            try{
                let authHeader = request.headers['authorization'],method = 'GET',path ='/userlogs';
                if(authHeader == undefined){
                    return h.response('Header missing in the request').code(401);
                }
                let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
                if(typeof resp != 'object'){
                    return h.response(resp).code(401);
                }
                let user = await redisClient.hGet('USER_DETAILS',String(resp.user_id));
                user = JSON.parse(user);
                console.log('Redis Details ::: ',user);
                console.log('IS USER ADMIN ::: ',user['IS_ADMIN']);
                if(user == null ){
                    response.msg = 'Improper user';
                    status = 400;
                }
                else if (!user.IS_ADMIN){
                    response.msg = 'User isn\'t admin So unable to perform the action';
                    status = 401;
                }
                else{
                    const elasticResult = deleteIndicesInElastic('baseproductsearch');
                    /* ELK ARK
                    let deleteIndexResult = await elasticClient.indices.delete({
                        index: ['baseproductsearch']
                    });
                    */
                    console.log('Delete Index result ::: ',elasticResult);
                    const baseProducts = await BaseItems.findAll({where : { BASE_ITEM_ID: {
                        [Sequelize.Op.ne]: null
                    }
                    }}
                    );
                    const response = await createIndex('baseproductsearch');
                    console.log('Received elastic response :: ',response);
                    for(const [key1,value1] of Object.entries(baseProducts)){
                        console.log('Key :::  ',key1,'value ::: ',value1);
                        let phraseToBeSearched = value1.dataValues.ITEM_NAME;
                        let itemDetails = value1.dataValues.ITEM_INFO;
                        for(const [key2,value2] of Object.entries(itemDetails)){
                            console.log(' VAL ABC ::: ',value2,' type of ::: ',typeof value2);
                            for(const key in value2){
                                console.log('value that needs to be indexed :: ',value2[key]);
                                phraseToBeSearched+=' ';
                                phraseToBeSearched+=value2[key];
                            }
                        }
                        console.log('Final concat Text ::: ',phraseToBeSearched);
                        let documentToPushToElastic = {
                            id : value1.dataValues.BASE_ITEM_ID,
                            content : phraseToBeSearched
                        };
                        const result = await insertDocumentsToELK('baseproductsearch',documentToPushToElastic);
                        /* ELK ARK
                        const result = await elasticClient.index({
                            index: "baseproductsearch",
                            document: {
                            id: value1.dataValues.BASE_ITEM_ID,
                            content: phraseToBeSearched,
                            },
                        });
                        */
                        console.log('Result after adding data :::: ',result);
                    }
                response.msg = 'Successfully indexed into Elastic Search';
                status = 200;
                }
            }
            catch(err){
                response.msg = 'Error occurred while inserting data into ELK';
                status = 500;
                logger.error({message : `ERROR MESSAGE : ${err.message} ERROR STACK ::::::: ${err.stack}`});
                logger.error({message : `ERROR DETAILS : ${JSON.stringify(err.errors)}`});
            }
            return h.response(response).code(status);
        }
    },
    {
        method : 'GET',
        path : '/user/signin',
        handler : async function(request,h){
            let query_params = request.query,uname = query_params['username'],pwd = query_params['password'],path = '/user/signin',method = 'GET';
            let resp = {}, status = 500;
            await User.findOne({where : { USERNAME : uname,PASSWORD : pwd }}).then((result) => {
                if(result == null){
                    resp.msg = 'Wrong Credentials';
                    logger.error(addRemoteIPToFileLogger('Wrong Credentials',request.location.ip,path,method));
                    status = 400;
                    // return h.response(resp).code(status);
                }
                else{
                    resp.msg = 'Successfully logged into the account';
                    status = 200;
                    let token = jwt.sign({ 
                        username : uname,
                        password : pwd,
                        user_id : result.USER_ID
                    }, 'SECRET_KEY_ARUN');
                    logger.info(addRemoteIPToFileLogger('Successfully logged into the account and Token provided in the response',request.location.ip,path,method));
                    resp.token = token;
                }
            }).catch(err => {
                console.log('Error occurred while executing statement : ',err);
                logger.error(addRemoteIPToFileLogger(`Error occurred while executing statement : ${err}`,request.location.ip,path,method));
            });
            return h.response(resp).code(status);
        
        },
        config : {
            validate : {
                query : Joi.object({
                    username : Joi.string().min(4).max(10).required(),
                    password : Joi.string().min(4).max(10).required()
                }
                ),
                failAction : function (request,h , source, error) {

                    // console.log('VAL OF SOURCE:',source);
                    // console.log('------------------------------');
                    let obj = [];
                    source.details.forEach(errorMsg => obj.push(errorMsg.message));
                    return h.response({ code: 400, message: obj}).takeover().code(400);
                    // return h.response({ code: 400, message: source.details[0].message}).takeover().code(400);
                    
                }
            }
        }
    },
    {
        method : 'GET',
        path : '/users',
        handler : function(request,h){
            // let headers = request.headers;
            let authHeader = request.headers['authorization'], method = 'GET',path = '/users';
            if(authHeader == undefined){
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
            if(typeof resp != 'object'){
                return h.response(resp).code(401);
            }
            // console.log('Response received : ',resp);
            // console.log('Username after decoding from token : ',resp['uname']);
            let uname = resp['uname'];
            if(admin_user_list.includes(uname)){
                let obj = {};
                for(const [key,value] of Object.entries(active_user_list)){
                    obj[key] = value.getPassword();
                }
                return h.response(obj).code(200);
            }
            else{
                return h.response('User isn\'t admin So unable to perform the action').code(401);
            }
            
        }
    
    },
    {
        method : ['POST'],
        path : '/product/outofstock',
        handler : async function(request,h){
            let authHeader = request.headers['authorization'],path = '/product/outofstock',method = request.method,payload = request.payload,status = 500,response = {};
            try{
                logger.info(addRemoteIPToFileLogger(`Inside the request`,request.location.ip,path,method));
                if(authHeader == undefined){
                    logger.warn(addRemoteIPToFileLogger(`Header missing in the request`,request.location.ip,path,method));
                    return h.response('Header missing in the request').code(401);
                }
                let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
                if(typeof resp != 'object'){
                    logger.warn(addRemoteIPToFileLogger(`Decoded value isn\'t an object`,request.location.ip,path,method));
                    return h.response(resp).code(401);
                }
                // const user = await User.findOne({where : { USER_ID : resp.user_id}});
                const user = await redisClient.hGet('USER_DETAILS',String(resp.user_id));
            
                    if(user == null){
                        response.msg = 'Improper user';
                        status = 400;
                    }
                    else if(user.IS_ADMIN == false){
                        response.msg = 'User not a Admin';
                        status = 401;
                    }
                    else{
                        const productPresent = await ProductDetails.findOne({where :{PRODUCT_ID :payload["product id"]}});
                        if(productPresent == null){
                            response.msg = 'Improper product id being passed';
                            status = 400;
                        }
                        else{
                            let updateJson = {AVAILABLE_QUANTITY : 0},quantity = productPresent.AVAILABLE_QUANTITY;
                            const product = await ProductDetails.update(updateJson, {where : {PRODUCT_ID :payload["product id"] }});
                            logger.info(addRemoteIPToFileLogger(`Product ID : ${payload['product id']} has been made to Out Of Stock `,request.location.ip,path,method));
                            let auditlog =  await AuditLogs.create({ACTIONS : 'Product out of stock',FIELDS_AFFECTED : updateJson,RECORD_ID : payload['product id'],USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['Product']});
                            logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                            response.msg = 'Product has been made to Out Of Stock ';
                            status = 200;
                        }
                    }
            }
            catch(error){
                response.msg = 'Error occurred while updating product ';
                logger.error(addRemoteIPToFileLogger(`Error occurred while updating product ${error}`,request.location.ip,path,method));
            }
            return h.response(response).code(status);
        },
        config : {
            validate : {
                payload : Joi.object(
                    {
                        'product id' : Joi.number().min(1).max(50).required()
                    }
                ),
                failAction : function (request,h , source, error) {
                    let obj = [];
                    source.details.forEach(errorMsg => obj.push(errorMsg.message));
                    return h.response({ code: 400, message: obj}).takeover().code(400);
                }
            }
        }
    },
    {
        method : 'POST',
        path : '/product/outofstockks',
        handler : async function(request,h){
            let authHeader = request.headers['authorization'],method = 'POST',path = '/product/outofstock',status = 500,response = {};
            try{
                if(authHeader == undefined){
                    return h.response('Header missing in the request').code(401);
                }
                let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
                console.log('Resp after token validation : ',resp);
                if(typeof resp != 'object'){
                    return h.response(resp).code(401);
                }

                const user = await User.findOne({where : { USER_ID : resp.user_id}});
                    if(user == null){
                        response.msg = 'Improper user';
                        status = 400;
                    }
                    else if(user.IS_ADMIN == false){
                        response.msg = 'User not a Admin';
                        status = 401;
                    }
                    else{
                        const productPresent = await ProductDetails.findOne({where :{PRODUCT_ID :payload['product id']}});
                        if(productPresent == null){
                            response.msg = 'Improper product id being passed';
                            status = 400;
                        }
                        else{
                            let updateJson = {AVAILABLE_QUANTITY : 0},quantity = productPresent.AVAILABLE_QUANTITY;
                            const product = await ProductDetails.update(updateJson, {where : {PRODUCT_ID :payload['product id'] }});
                            logger.info(addRemoteIPToFileLogger(`Product ID : ${payload['product id']} has been made to Out Of Stock `,request.location.ip,path,method));
                            let auditlog =  await AuditLogs.create({ACTIONS : 'Product out of stock',FIELDS_AFFECTED : updateJson,RECORD_ID : payload['product id'],USER_ID : resp.user_id,MODULE_ID : moduleWithIdDetails['Product']});
                            logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                            response.msg = 'Product has been made to Out Of Stock ';
                            status = 200;
                        }
                    }
            }
            catch(error){
                response.msg = 'Error occurred while making product out of stock';
                logger.error(addRemoteIPToFileLogger(`Error occurred while making product out of stock ${error}`,request.location.ip,path,method));
            }
            return h.response(response).code(status);
        }
    },
    {
        method : 'POST',
        path : '/makeuseradmin',
        handler : async function(request,h){
            let resp = {}, status = 500,method = 'POST',path = '/makeuseradmin';
            try{
                let queryparams = request.query,user_id = queryparams['user id'];

                const user = await User.findOne({where : { USER_ID : user_id }});
                if(user == null){
                    resp.msg = 'Invalid username provided';
                    logger.error(addRemoteIPToFileLogger('Invalid username provided',request.location.ip,path,method));
                    status = 400;
                }
                else{
                    if(user.IS_ADMIN == true){
                        resp.msg = `Mentioned user ID : ${user_id} is already an Admin`;
                        status = 200;
                    }
                    else{
                        let updateJson = { IS_ADMIN : true};
                        const userUpdate = User.update(updateJson,{ where : { USER_ID : user_id}});
                        logger.info(addRemoteIPToFileLogger(`User ID : ${user_id} has been made as Admin successfully in DB`,request.location.ip,path,method));
                        let redisUserUpdate = await redisClient.hGet('USER_DETAILS',String(user_id));
                        redisUserUpdate = JSON.parse(redisUserUpdate);
                        // console.log('Before update JSON :::: ',redisUserUpdate);
                        redisUserUpdate.IS_ADMIN = true;
                        // console.log('update JSON :::: ',redisUserUpdate);
                        let updateResult = await redisClient.hSet('USER_DETAILS',user_id,JSON.stringify(redisUserUpdate));
                        // console.log('Redis result ::: ', updateResult);
                        // let redisUserUpdatee = await redisClient.hGet('USER_DETAILS',String(user_id));
                        // // console.log('after update getting from Redis ::: ',redisUserUpdatee);
                        logger.info(addRemoteIPToFileLogger(`User ID : ${user_id} has been made as Admin successfully in Redis`,request.location.ip,path,method));
                        let auditlog =  await AuditLogs.create({ACTIONS : 'Making User Admin',FIELDS_AFFECTED : updateJson,RECORD_ID : user_id,USER_ID : user_id,MODULE_ID : moduleWithIdDetails['User']});
                        logger.info(addRemoteIPToFileLogger(`Added entry to Audit Log ID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                        resp.msg = `Updated user ID : ${user_id} as Admin`;
                        status = 200;
                    }
                }
            }    
            catch(error){
                logger.error(addRemoteIPToFileLogger(`Error occurred while making user as Admin : ${error}`,request.location.ip,path,method));
                resp.msg = 'Error occurred while making user as Admin';
            }
            return h.response(resp).code(status);
        },
        config : {
            validate : {
                query : Joi.object({
                    'user id' : Joi.number().min(1).max(500).required()
                }
                ),
                failAction : function (request,h , source, error) {
                    return h.response({ code: 400, message: source.details[0].message}).takeover().code(400);
                }
            }
        }
    },
    {
        method : ['POST','PUT'],
        path : '/user/signup',
        handler : async function(request,h){
            console.log('Path details : ',this.path);
            try{
                let query_params = request.payload,path = '/user/signup', method = request.method;
                let uname = query_params['username'],pwd = query_params['password'],email = query_params['email'];
                let updateJson = {FIRST_NAME : query_params['first name'] , USERNAME : uname , PASSWORD : pwd, EMAIL : email, PHONE : String(query_params['phone'])};
                if(query_params['last name'] != null){
                    updateJson.LAST_NAME = query_params['last name'];
                }
                console.log('User create query ::::: ',updateJson);
                let result = await User.create(updateJson);
                logger.info(addRemoteIPToFileLogger(`Successfully created account with user name as : ${uname} in DB`,request.location.ip,path,method));
                let jobName = 'NewUser_'+result.USER_ID;
                await newUserQueue.add(jobName,{name : result.FIRST_NAME,email : result.EMAIL},{
                    removeOnComplete : true,
                    removeOnFail: {
                        age: 24 * 3600
                    }
                });
                const newUserInRedis = await redisClient.hSet('USER_DETAILS',result.USER_ID,JSON.stringify({ IS_ADMIN : true , FIRST_NAME : result.FIRST_NAME,EMAIL : result.EMAIL}));
                // console.log('Result is ::: ',newUserInRedis);
                // console.log('JSON format ::: ',JSON.parse(newUserInRedis));
                // let getUser = await redisClient.hGet('USER_DETAILS',String(result.USER_ID));
                logger.info(addRemoteIPToFileLogger(`Successfully created account with user name as : ${uname} in Redis`,request.location.ip,path,method));
                // getUser.then((result)=>{
                //     console.log('Redis call successfull ::::::: ',result);
                // }).catch(err => {
                //     console.log('Redis call failed ::::::: ',err);
                //     console.log('type of err is :::::: ',typeof err);
                //     console.log(`Redis call failed ::::::: ${JSON.stringify(err)}`);
                // });

                // console.log('Output Result is ::: ',getUser);
                // console.log('Output JSON format ::: ',JSON.parse(getUser));

                logger.info(addRemoteIPToFileLogger(`Job name : ${jobName} has been added to queue : NewUser`,request.location.ip,path,method));
                let auditlog = await AuditLogs.create({ACTIONS : 'New User Creation',FIELDS_AFFECTED : updateJson,RECORD_ID : result.USER_ID,USER_ID : result.USER_ID,MODULE_ID : moduleWithIdDetails['User']});
                logger.info(addRemoteIPToFileLogger(`Entry added to AuditLog AuditLogID : ${auditlog.AUDIT_LOG_ID}`,request.location.ip,path,method));
                return h.response({message : 'Successfully created account'}).code(200);
            }
            catch(err){
                let errorObj = {};
                errorObj.error_message = err.message;
                errorObj.message = 'Unable to create account at this moment';
                if(err.errors != null){
                    let invalidInputs = [];
                    err.errors.forEach(obj =>invalidInputs.push(obj.message));
                    errorObj['Reasons'] = invalidInputs;
                }
                logger.error(addRemoteIPToFileLogger(`Unable to create account at this moment with user name as : ${request.payload['username']}`,request.location,'/user/signup',request.method));
                logger.error({message : `ERROR MESSAGE : ${err.message} ERROR STACK ::::::: ${err.stack}`});
                logger.error({message : `ERROR DETAILS : ${JSON.stringify(err.errors)}`});
                return h.response(errorObj).code(500);
            }
        },
        config : {
            tags : ['New Account'],
            description : 'Use this API by sending proper values in Request payload for creating new account',
            notes : `username, password and email id are considered as mandatory
                     Username is considered unique
                     If the username provided in the payload matches any of the pre-exisiting users in backend then error will be thrown
                     Email ID is also considered unique as well
                     ONLY WHEN USERNAME and EMAIL address provided in payload is unique then the request will be successful`,
            validate : {
                        payload : Joi.object({
                                username : Joi.string().min(4).max(10).required(),
                                password : Joi.string().min(4).max(10).required(),
                                email: Joi.string().email().required(),
                                'first name' : Joi.string().min(5).max(10).required(),
                                'last name': Joi.string().min(1).max(10),
                                phone : Joi.number().integer().min(7 * (10 ** 9)).max((10 ** 10) - 1)
                            }
                            ),
                            failAction : function (request,h , source, error) {
            
                                console.log('VAL OF SOURCE:',source);
                                console.log('------------------------------');
                                let obj = [];
                                source.details.forEach(errorMsg => obj.push(errorMsg.message));
                                return h.response({ code: 400, message: obj}).takeover().code(400);
                            }
                        }
        }
    }]
)


// module.exports = addRemoteIPToFileLogger;
