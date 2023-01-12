const Hapi = require('hapi'),user = require('./User'),loggingFunction = require('./helperfunctions.js'),jwt = require('jsonwebtoken'),winston = require('winston');
const Joi = require('joi');
// const loggerFile = require('./logger.js')
const logger = require('./logger.js');
const {Sequelize , DataTypes} = require('sequelize');
const sequelize = require('./sequelize-init');
const invoice = require('./modelsnn/invoice');

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

User.hasMany(Address,{foreignKey: 'USER_ID'});
// User.belongsTo(Address,{foreignKey: 'PRIMARY_ADDRESS_ID'});
AmartConstants.hasMany(AmartFields,{foreignKey: 'MODULE_ID'});
User.hasMany(AuditLogs,{foreignKey: 'USER_ID'});
AmartConstants.hasMany(AuditLogs,{foreignKey: 'MODULE_ID'});
User.hasMany(BaseItems,{foreignKey: 'CREATED_USER'});
User.hasMany(Invoice,{foreignKey: 'BROUGHT_BY'});
Address.hasMany(Invoice,{foreignKey: 'DELIVERY_ADDRESS'});
Invoice.hasMany(InvoiceLineItems,{foreignKey: 'INVOICE_ID'});
ProductDetails.hasMany(InvoiceLineItems,{foreignKey: 'PRODUCT_ID'});
User.hasMany(ProductDetails,{foreignKey: 'CREATED_USER'});
BaseItems.hasMany(ProductDetails,{foreignKey: 'BASE_ITEM_ID'});
AmartConstants.hasMany(ProductDetails,{foreignKey: 'CATEGORY_ID'});
SubCategoryDetails.hasMany(ProductDetails,{foreignKey: 'SUB_CATEGORY_ID'});
AmartConstants.hasMany(SubCategoryDetails,{foreignKey: 'CATEGORY_ID'});



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


const categoryWithSubCategories = {};
categoryWithSubCategories['electronics'] = {};
categoryWithSubCategories['electronics']['pendrives'] = ['hp_64_gb','sandish_64_gb','transcend_64_gb'];
categoryWithSubCategories['electronics']['phones'] = ['iphone14','oneplus10','samsung galaxy Z1 ultra'];
categoryWithSubCategories['clothes'] = {};
categoryWithSubCategories['clothes']['tshirts'] = ['tshirt A','tshirt B','tshirt C'];
categoryWithSubCategories['clothes']['jeans'] = ['jean A','jean B','jean C'];

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
const products = {
    'jean A' : {
        name : 'jean A',
        available_sizes : '32,34,36,38',
        price_in_Rs : 1000,
        discounted_price : 900,
        Out_of_stock : false
    },
    'jean B' : {
        name : 'jean B',
        available_sizes : '32,34',
        price_in_Rs : 1200,
        discounted_price : 1150,
        Out_of_stock : false
    },
    'jean C' : {
        name : 'jean C',
        available_sizes : '36,38',
        price_in_Rs : 15000,
        discounted_price : 1300,
        Out_of_stock : false
    },
    'tshirt A' : {
        name : 'tshirt A',
        available_sizes : '38,40,42,44',
        price_in_Rs : 500,
        discounted_price : 450,
        Out_of_stock : false
    },
    'tshirt B' : {
        name : 'tshirt B',
        available_sizes : '40,42,44',
        price_in_Rs : 400,
        discounted_price : 380,
        Out_of_stock : false
    },
    'tshirt C' : {
        name : 'tshirt C',
        available_sizes : '38,42,44',
        price_in_Rs : 200,
        discounted_price : 190,
        Out_of_stock : false
    },
    'iphone14' : {
        name : 'iPhone 14 3GB RAM, 128GB internal',
        price_in_Rs : 60000,
        discounted_price : 55000,
        Out_of_stock : false
    },
    'oneplus10' : {
        name : 'OnePlus 10 8GB RAM, 128GB internal',
        price_in_Rs : 40000,
        discounted_price : 33000,
        Out_of_stock : false
    },
    'samsung galaxy Z1 ultra' : {
        name : 'Samsung Galaxy Z1 Ultra 12GB RAM, 256GB internal',
        price_in_Rs : 70000,
        discounted_price : 66000,
        Out_of_stock : false
    },
    'hp_64_gb' : {
        name : 'HP 64 GB Pendrive',
        price_in_Rs : 400,
        discounted_price : 350,
        Out_of_stock : false
    },
    'sandish_64_gb' : {
        name : 'Sandisk 64 GB Pendrive',
        price_in_Rs : 200,
        discounted_price : 150,
        Out_of_stock : false
    },
    'transcend_64_gb' : {
        name : 'Transcend 64 GB Pendrive',
        price_in_Rs : 300,
        discounted_price : 250,
        Out_of_stock : false
    }
};

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
    require('./modelsnn/index');

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
    logger.info(addRemoteIPToFileLogger(JSON.stringify(obj), request.location.ip,request.path,request.method));
    logger.info(addRemoteIPToFileLogger('Inside server events on ', request.location.ip,request.path,request.method));
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
        path : '/getAllProducts',
        handler : function(request,h){
            let headers = request.headers,method = 'GET',path = '/getAllProducts';
            let authHeader = headers['authorization'];
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
            let query_params = request.query,category = query_params['category'],obj = {};
            if(category == undefined){
                obj.products = products;
                obj.message = 'Kindly use Category as query params to filter the results';
                return h.response(obj).code(200);
            }
            else if( category == '' || categoryWithSubCategories[category] == undefined){
                obj.products = products;
                obj.message = 'Mentioned value for Category query param is invalid.Kindly use proper value for Category query params';
                return h.response(obj).code(200);
            }
            else{
                let subcategory = query_params['subcategory'];
                if(subcategory == undefined || subcategory == '' || categoryWithSubCategories[category][subcategory] == undefined){
                        // let productArray = [];
                        obj.product = {};
                        // console.log('TYPE !! : ',typeof products[category]);
                        // for(const [key,value] of Object.entries(products[category])){
                        //     console.log('Value for json is ',value);
                        //     console.log('TYPE : ',typeof value);
                        //     for(const [key2,value2] of Object.entries(value)){
                        //         // productArray.push(value2);
                        //         obj.product[key2] = value2;
                        //     }
                        // }
                        for(const [key,value] of Object.entries(categoryWithSubCategories[category])){
                            value.forEach(prod => {
                                obj.product[prod] = products[prod];
                            });
                        }
                        // obj.product = productArray;
                        if(subcategory == undefined){
                            obj.message = 'Kindly use Sub Category as query param to filter the results further';
                        }
                        else{
                            obj.message = 'Mentioned value for Sub Category query param is invalid.Kindly provide proper value for Sub Category query param';
                        }
                        return h.response(obj).code(200);
                    
                }
                else{
                    // let productArray = [];
                    // for(const [key2,value2] of Object.entries(products[category][subcategory])){
                    //     obj[key2] = value2;
                    //     // productArray.push(value2);
                    // }
                    // obj.product = productArray;
                    obj.product = {};
                    categoryWithSubCategories[category][subcategory].forEach(prod => {
                        obj.product[prod] = products[prod];
                    });
                    return h.response(obj).code(200);
                }
            }

            

            return h.response(products).code(200);
        },
        config : {
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
            let path = '/addtocart',method = request.method,output = {} , status = 500,payload = request.payload;
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
            await User.findOne({where : { USER_ID : resp.user_id }}).then(async (result) => {
                if(result.IS_ADMIN == false){
                    output.msg = 'User isn\'t admin So unable to perform the action';
                    status = 401;
                }
                else{
                    let categoryId;
                    await AmartConstants.create({VALUE : payload['name'] , TYPE : 0 }).then((category) => {
                        categoryId = category.CONSTANT_ID;
                    }).catch(err => {
                        logger.error((addRemoteIPToFileLogger(`Error occurrred while creating category in DB ${err} `,request.location.ip,path,method)));
                    });
                    output.msg = 'Successfully created category';
                    output['category id'] = categoryId;
                    status = 200;
                    logger.info(addRemoteIPToFileLogger(`Successfully created category ID : ${categoryId}`,request.location.ip,path,method));
                }
            }).catch(err => {
                output.msg = 'Error occurred while creating category';
                logger.error(addRemoteIPToFileLogger(`Error occurred while checking user is Admin: : ${err}`,request.location.ip,path,method));
            });
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
            let path = '/addtocart',method = request.method,output = {} , status = 500,payload = request.payload;
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
            await User.findOne({where : { USER_ID : resp.user_id }}).then(async (result) => {
                if(result.IS_ADMIN == false){
                    output.msg = 'User isn\'t admin So unable to perform the action';
                    status = 401;
                }
                else{
                    let categoryId = payload['categoryid'],name = payload['subcategory name'],subcategoryId;
                    await AmartConstants.findOne({ where : {CONSTANT_ID : categoryId}}).then(async category => {
                        if(category == null){
                            output.msg = 'Invalid category Id being provided';
                            status = 401;
                        }
                        else{
                            await SubCategoryDetails.create({ SUB_CATEGORY_NAME : name, CATEGORY_ID : categoryId}).then(subcategory => {
                                output.msg = 'Successfully created subcategory';
                                output['sub category id'] = subcategory.SUB_CATEGORY_ID;
                                status = 200;
                            })
                        }
                    }).catch(err => {
                        output.msg = 'Error occurred while creating subcategory';
                        logger.error((addRemoteIPToFileLogger(`Error occurrred while creating subcategory in DB ${err} `,request.location.ip,path,method)));
                    });
                    
                    logger.info(addRemoteIPToFileLogger(`Successfully created sub category ID : ${subcategoryId}`,request.location.ip,path,method));
                }
            }).catch(err => {
                output.msg = 'Error occurred while creating subcategory';
                logger.error(addRemoteIPToFileLogger(`Error occurred while checking user is Admin: : ${err}`,request.location.ip,path,method));
            });
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
        handler : function(request,h){
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
            // console.log('Response received : ',resp);
            // console.log('Username after decoding from token : ',resp['uname']);
            let uname = resp['uname'];
            let itemToAddToCart = request.payload,item_name = itemToAddToCart['itemname'];
            if(item_name == undefined || item_name == ''){
                logger.info((addRemoteIPToFileLogger(`Item name being passed is invalid value : ${item_name}`,request.location.ip,path,method)));
                return h.response('Kindly provide valid item name to add to Cart').code(400);
            }
            else if(products[item_name] == undefined){
                logger.info((addRemoteIPToFileLogger(`There isn\'t a key in products with the mentioned item name : ${item_name}`,request.location.ip,path,method)));
                return h.response('Mentioned item name isn\'t valid.Kindly provide valid item name').code(400);
            }
            else{
                if(uname == undefined || uname == '' || !(uname in active_user_list)){
                    return h.response('Kindly provide username in the query params to add the item to his cart').code(400);
                }
                else if(!(uname in active_user_list)){
                    logger.info((addRemoteIPToFileLogger(`Mentioned username isn\'t valid Kindly provide valid username : ${uname}`,request.location.ip,path,method)));
                    return h.response('Mentioned username isn\'t valid Kindly provide valid username').code(400);
                }
                else{
                    let userCart = userCartDetails[uname];
                    logger.info((addRemoteIPToFileLogger(`User cart details before adding the item : ${userCart}`,request.location.ip,path,method)));
                    if(userCart == undefined){
                        userCart = [];
                    }
                    userCart.push(item_name);
                    userCartDetails[uname] = userCart;
                    logger.info((addRemoteIPToFileLogger(`User cart details after adding the item to cart : ${userCart}`,request.location.ip,path,method)));
                    let msg = `Item : ${item_name} successfully added to cart`;
                    logger.info((addRemoteIPToFileLogger(`Successfully added the item to cart NEW ITEM NAME : ${item_name}`,request.location.ip,path,method)));
                    logs[uname] = loggingFunction.loggingTheActionToGlobalVariable(msg,request.location,logs[uname]);
                    return h.response(msg).code(200);
                }
            }

        },
        config: {
            validate : {
                    payload : Joi.object(
                        {
                            itemname : Joi.string().min(4).max(25).required()
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
        handler : function(request,h){
            let authHeader = request.headers['authorization'],path = '/getcart',method = request.method;
            logger.info(addRemoteIPToFileLogger(`Inside /getcart request`,request.location.ip,path,method));
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
            // console.log('Username after decoding from token : ',resp['uname']);
            let uname = resp['uname'];
            if(uname == undefined || uname == ''){
                return h.response('Kindly provide username to get his cart details').code(400);
            }
            else if(!(uname in active_user_list)){
                logger.warn(addRemoteIPToFileLogger(`Mentioned user : ${uname} isn\'t a valid user Kindly provide valid value for username param`,request.location.ip,path,method));
                return h.response('Mentioned user isn\'t a valid user Kindly provide valid value for username param ').code(400);
            }
            else{
                let cartDetils = userCartDetails[uname],obj={};
                obj.userCart = cartDetils;
                logger.info(addRemoteIPToFileLogger(`Cart details of the user : ${JSON.stringify(cartDetils)}`,request.location.ip,path,method));
                logs[uname] = loggingFunction.loggingTheActionToGlobalVariable('user accessing cart',request.location,logs[uname]);
                return h.response(obj).code(200);
            }
        }
    },
    {
        method : 'POST',
        path : '/addproduct',
        handler : async function(request,h){
            let authHeader = request.headers['authorization'],path = '/addproduct',method = request.method,payload = JSON.parse(request.payload);
            // console.log('JJJJJ    KKKKKK  LLLLLL  MMMMM ');
            // console.log(typeof payload["varieties"]);
            // let varieties = payload["varieties"];
            // varieties.forEach(variety =>{
            //     console.log(' &&&&&&&&&&&&&&&& ');
            //     console.log("RAM ::: ",variety["RAM"]);
            //     console.log("memory :::  ",variety['memory']);
            //     console.log("original price in rupees ::: ",variety['original price in rupees']);
            //     console.log("discounted price in rupees :::  ",variety['discounted price in rupees']);
            //     console.log("available quantities ::: ",variety['available quantities']);
            //     console.log(' &&&&&&&&&&&&&&&& ');
            // })
            // return h.response('Hi Arun').code(200);
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
            // console.log('Response received : ',resp);
            // console.log('Username after decoding from token : ',resp['uname']);
            let output = {},status = 500,userId;
            console.log("asdfasdf    " ,resp);

            await User.findOne({where : { USER_ID : resp.user_id }}).then(async (result) => {
                userId = result.USER_ID;
                if(result.IS_ADMIN == false){
                    output.msg = 'User isn\'t admin So unable to perform the action';
                    status = 401;
                }
                else{
                    await BaseItems.create({ITEM_NAME : payload['name'],ITEM_INFO : payload['basic'],CREATED_USER : userId}).then((baseitems) => {
                        // baseitems.createProductDetails({ADDITONAL_INFO : payload[]})
                        // console.log('JJJJJ    KKKKKK  LLLLLL  MMMMM ');
                        // console.log(typeof payload['varieties']);
                        let varieties = payload["varieties"];
                        varieties.forEach(async variety =>{
                            let item_price = variety['original price in rupees'],discount_price = variety['discounted price in rupees'],available_qty = variety['available quantities'];
                            delete variety['original price in rupees'];
                            delete variety['discounted price in rupees'];
                            delete variety['available quantities'];
                            output.msg = `Product successfully got created`;
                            status = 200;
                            let arr = [];
                            await ProductDetails.create({ADDITONAL_INFO : variety, AVAILABLE_QUANTITY : available_qty, ORIGINAL_PRICE : item_price, DISCOUNTED_PRICE : discount_price,CREATED_USER : result.USER_ID, BASE_ITEM_ID : baseitems.BASE_ITEM_ID,CATEGORY_ID : payload['category'], SUB_CATEGORY_ID : payload['subcategory'], IS_ACTIVE : true}).then(product => {
                                logger.info(addRemoteIPToFileLogger(`Product successfully got created  ${product.PRODUCT_ID}`,request.location.ip,path,method));
                                // output.msg = `Product successfully got created`;
                                arr.push(product.PRODUCT_ID);
                                // status = 200;
                            });
                            output['Created product id\'s'] = arr;

                        })
                    }).catch(err => {
                        logger.error(addRemoteIPToFileLogger(`Error occurred while creating Base Items ${err}`,request.location.ip,path,method));
                        output.msg = 'Error occurred while creating products';
                    });
                }
            }).catch(err => {
                output.msg = `Error occurred while creating products`;
                logger.error(addRemoteIPToFileLogger(`Error occurred while executing statement : ${err}`,request.location.ip,path,method));
            });

            return h.response(output).code(status);
            // if(admin_user_list.includes(uname)){
            //     let item_name = payload['item_name'],category = payload['category'],subcategory = payload['subcategory'];
            //     logger.info(addRemoteIPToFileLogger(`Payload received in the request ${JSON.stringify(payload)}`,request.location.ip,path,method));
            //     if(!(admin_user_list.includes(uname))){
            //         logger.warn(addRemoteIPToFileLogger(`Unable to add the product since user is not a Admin ${uname}`,request.location.ip,path,method));
            //         return h.response('Unable to add the product since user is not a Admin').code(400);
            //     }
            //     else if(category == undefined || category == ''){
            //         logger.warn(addRemoteIPToFileLogger(`Category param is empty`,request.location.ip,path,method));
            //         return h.response('Category param is empty kindly provie proper value to add the product').code(400);
            //     }
            //     else if(subcategory == undefined || subcategory == ''){
            //         logger.warn(addRemoteIPToFileLogger(`Sub category param is empty`,request.location.ip,path,method));
            //         return h.response('Sub category param is empty kindly provie proper value to add the product').code(400);
            //     }
            //     else if(item_name == undefined || item_name == ''){
            //         logger.warn(addRemoteIPToFileLogger('Item name is empty kindly provide valid item name',request.location.ip,path,method));
            //         return h.response('Item name is empty kindly provide valid item name').code(400);
            //     }
            //     else{
            //         let invalidPayload = [],name = payload['name to show in ui'], price_in_Rs = payload['price_in_Rs'],discounted_price = payload['discounted_price'];
            //         if(name == undefined || name == '' ){
            //             invalidPayload.push('name to show in ui param is empty.kindly provide proper value');
            //         }
            //         if(price_in_Rs == undefined || price_in_Rs == '' ){
            //             invalidPayload.push('Price in Rs param is empty.kindly provide proper value');
            //         }
            //         if(discounted_price == undefined || discounted_price == ''){
            //             invalidPayload.push('Discounted price in Rs param is empty.kindly provide proper value');
            //         }
            //         if(invalidPayload.length > 0){
            //             let errorObj = {};
            //             errorObj['message'] = 'Certain essential keys are missing in the payload';
            //             errorObj['keys missing'] = invalidPayload;
            //             logger.warn(addRemoteIPToFileLogger(`Invalid keys in payload ${invalidPayload}`,request.location.ip,path,method));
            //             return h.response(errorObj).code(400);
            //         }
            //         else{
            //             let newproductObj = {};
            //             newproductObj["name"] = name;
            //             newproductObj["price_in_Rs"] = price_in_Rs;
            //             newproductObj["discounted_price"] = discounted_price;
            //             if(categoryWithSubCategories[category][subcategory] == undefined){
            //                 categoryWithSubCategories[category][subcategory] = [];
            //             }
            //             categoryWithSubCategories[category][subcategory].push(item_name);
            //             products[item_name] = newproductObj;
            //             logger.info(addRemoteIPToFileLogger('Item has been successfully added',request.location.ip,path,method));
            //             return h.response('Item has been successfully added').code(200);
            //         }
            //     }
            // }
            // else{
            //     return h.response('User isn\'t admin So unable to perform the action').code(401);
            // }
        }
    },
    {
        method : 'DELETE',
        path : '/products/delete',
        handler : function(request,h){
            let authHeader = request.headers['authorization'],path = '/addproduct',method = request.method;
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
            // console.log('Response received : ',resp);
            // console.log('Username after decoding from token : ',resp['uname']);
            let uname = resp['uname'];
            if(admin_user_list.includes(uname)){
                let payload = JSON.parse(request.payload),item_name = payload['item_name'],category = payload['category'],subcategory = payload['subcategory'];
            if(uname == undefined || uname == ''){
                return h.response('username param in payload is mandatory Kindly provide it').code(400)
            }
            else if(!(admin_user_list.includes(uname))){
                logger.warn(addRemoteIPToFileLogger(`Unable to add the product since user is not a Admin`,request.location.ip,path,method));
                return h.response('Unable to add the product since user is not a Admin').code(401);
            }
            else if(category == undefined || category == ''){
                logger.error(addRemoteIPToFileLogger(`Category param is empty kindly `,request.location.ip,path,method));
                return h.response('Category param is empty kindly provie proper value to add the product').code(400);
            }
            else if(subcategory == undefined || subcategory == ''){
                logger.error(addRemoteIPToFileLogger(`Sub category param is empty kindly`,request.location.ip,path,method));
                return h.response('Sub category param is empty kindly provie proper value to add the product').code(400);
            }
            else if(item_name == undefined || item_name == ''){
                logger.error(addRemoteIPToFileLogger(`Item name is empty `,request.location.ip,path,method));
                return h.response('Item name is empty kindly provide valid item name').code(400);
            }
            else{
                if(categoryWithSubCategories[category] == undefined){
                    logger.error(addRemoteIPToFileLogger(`Improper category name provided ${category} `,request.location.ip,path,method));
                    return h.response('Improper category name provided').code(400);
                }
                else if(categoryWithSubCategories[category][subcategory] == undefined){
                    logger.error(addRemoteIPToFileLogger(`Improper subcategory name provided ${subcategory} `,request.location.ip,path,method));
                    return h.response('Improper sub category name provided').code(400);
                }
                else{
                    let productArray = categoryWithSubCategories[category][subcategory];
                    let indexOfProductToBeRemoved = productArray.indexOf(item_name);
                    if(indexOfProductToBeRemoved == -1){
                        logger.error(addRemoteIPToFileLogger(`Invalid item name being passed in the request ${item_name} `,request.location.ip,path,method));
                        return h.response('Invalid item name being passed in the request').code(400);
                    }
                    let finalArray = productArray.splice(0,indexOfProductToBeRemoved).concat(productArray.splice(1));
                    categoryWithSubCategories[category][subcategory] = finalArray;
                    delete products[item_name];
                    logger.error(addRemoteIPToFileLogger(`Product has been removed successfully `,request.location.ip,path,method));
                    return h.response('Product has been removed successfully').code(200);
                }
            }
        }
    }
    },
    {
        method : ['PUT','POST'],
        path : '/products/edit',
        handler : function(request,h){
            let authHeader = request.headers['authorization'],path = '/addproduct',method = request.method;
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
            // console.log('Response received : ',resp);
            // console.log('Username after decoding from token : ',resp['uname']);
            let uname = resp['uname'];
            if(admin_user_list.includes(uname)){
                let payload = JSON.parse(request.payload),item_name = payload['item_name'];
            if(uname == undefined || uname == '' || !(uname in active_user_list)){
                return h.response('kindly provide valid username in request payload').code(400);
            }
            else if(!(admin_user_list.includes(uname))){
                logger.warn(addRemoteIPToFileLogger(`Unable to add the product since user is not a Admin`,request.location.ip,path,method));
                return h.response('Unable to perform action since user isn\'t an Admin').code(400);
            }
            else if(!(item_name in products)){
                logger.error(addRemoteIPToFileLogger(`Invalid item name being passed in the request ${item_name} `,request.location.ip,path,method));
                return h.response('Mentioned item name is improper').code(400);
            }
            else{
                let productDetails = products[item_name],invalid_keys = [],updated_keys = [];
                for(const [key,value] of Object.entries(payload)){
                    if(key in productDetails){
                        productDetails[key] = value;
                        updated_keys.push(key);
                    }
                    else{
                        invalid_keys.push(key);
                    }
                }
                products[item_name] = productDetails;
                let resultobj = {};
                resultobj['updated_keys'] = updated_keys;
                resultobj['invalid_keys'] = invalid_keys;
                logger.info(addRemoteIPToFileLogger(`updated keys : ${updated_keys} invalid keys : ${invalid_keys}`,request.location.ip,path,method));
                return h.response(resultobj).code(200);
            }
        }
    }
    },
    {
        method : 'POST',
        path : '/getcart/buy',
        handler : function(request,h){
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
            // console.log('Response received : ',resp);
            // console.log('Username after decoding from token : ',resp['uname']);
            let uname = resp['uname'];
            let payload = request.payload,itemsAndQuantities = payload['items'];
            let invoice = {};
            if(uname == undefined || uname == '' || !(uname in active_user_list)){
                return h.response('kindly provide valid username in request payload').code(400);
            }
            let total_price_of_ordered_items =  0,unplaced_items = [];
            for(const [key,value] of Object.entries(itemsAndQuantities)){
                if(!(key in products)){
                    logger.warn(addRemoteIPToFileLogger(`Item name being passed is invalid :::: ${key}`,request.location.ip,path,method));
                    return h.response(`Invalid item name : ${key} being passed`).code(400);
                }
                if(products[key]['Out_of_stock'] == true){
                    unplaced_items.push(key);
                }
                let quantity = Number(value);
                console.log('QUANTITY : ',quantity);
                if(isNaN(quantity)){
                    logger.warn(addRemoteIPToFileLogger(`Invalid quantity : ${value} being provided for item : ${key}`,request.location.ip,path,method));
                    return h.response(`Invalid quantity : ${value} being provided for item : ${key}`).code(400);
                }
                let obj = {};
                obj['item_name'] = key;
                obj['quantity'] = quantity;
                obj['unit price'] = products[key].discounted_price;
                obj['total price'] = quantity * products[key].discounted_price;
                total_price_of_ordered_items = total_price_of_ordered_items + obj['total price'];
                invoice[key] = obj;
            }
            invoice['total_price_in_rupees'] = total_price_of_ordered_items;
            let userAlreadyOrderedItems = userOrderedItems[uname];
            // if(JSON.stringify() userAlreadyOrderedItems == undefined){
            //     logVal = '';
            // }
            logger.info(addRemoteIPToFileLogger(`User ordered items before adding current items : ${JSON.stringify(userAlreadyOrderedItems)}`,request.location.ip,path,method));
            if(userAlreadyOrderedItems == undefined){
                userAlreadyOrderedItems = [];
            }
            userAlreadyOrderedItems.push(invoice);
            userOrderedItems[uname] = userAlreadyOrderedItems;
            logger.info(addRemoteIPToFileLogger(`User ordered items after adding current items : ${JSON.stringify(userAlreadyOrderedItems)}`,request.location.ip,path,method));
            logger.info(addRemoteIPToFileLogger(`Items has been successfully placed`,request.location.ip,path,method));
            // let resObj["unplaced items"] = {};
            console.log(userOrderedItems);
            logs[uname] = loggingFunction.loggingTheActionToGlobalVariable(`User placed an order`,request.location,logs[uname]);
            let resObj = {};
            resObj["message"] = 'Items has been placed successfully';
            if(unplaced_items.length > 0){
                // let resObj['unplaced_items'] = new Object();
                resObj['unplaced_items'] = unplaced_items;
                // resObj.unplaced_items["item list"] = unplaced_items;
                // resObj.unplaced_items["reason"] = 'Above items are Out of Stock So unable to place order for them';
            }
            return h.response(resObj).code(200);
        },
        config : {
            validate : {
                payload : Joi.object(
                    {
                        items : Joi.object().pattern(Joi.string().min(4).max(25).required(), Joi.number().min(1).max(4).required())
                        // Joi.string().min(4).max(25).required()
                    }
                ),
                failAction : function (request,h , source, error) {

                    console.log('VAL OF SOURCE:',source);
                    console.log('------------------------------');
                    let obj = [];
                    source.details.forEach(errorMsg => obj.push(errorMsg.message));
                    return h.response({ code: 400, message: obj}).takeover().code(400);
                    // return h.response({ code: 400, message: source.details[0].message}).takeover().code(400);
                    
                }
            }
        }
    },
    {
        method : 'POST',
        path : '/buy',
        handler : function(request,h){
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
            // console.log('Response received : ',resp);
            // console.log('Username after decoding from token : ',resp['uname']);
            let uname = resp['uname'];
            let payload = request.payload,item_name = payload['itemname'],qty = payload['quantity'];
            let invoice = {};
            if(uname == undefined || uname == '' || !(uname in active_user_list)){
                return h.response('kindly provide valid username in request payload').code(400);
            }
            if(!(item_name in products)){
                logger.warn(addRemoteIPToFileLogger(`Item name being passed is invalid :::: ${item_name}`,request.location.ip,path,method));
                return h.response('Item name is invalid.Kindly mention it properly').code(400);
            }
            if(products[item_name]['Out_of_stock'] == true){
                logger.warn(addRemoteIPToFileLogger(`Item name being passed is currently Out of Stock :::: ${item_name}`,request.location.ip,path,method));
                return h.response(`Item is Out of Stock now So unable to place order for them`).code(200);
            }
            let previousOrderedItems = userOrderedItems[uname];
            logger.info(addRemoteIPToFileLogger(`User ordered items before adding current items : ${JSON.stringify(previousOrderedItems)}`,request.location.ip,path,method));
            if(previousOrderedItems == undefined){
                previousOrderedItems = [];
            }
            invoice['item_name'] = item_name;
            invoice['quantity'] = qty;
            invoice['unit price'] = products[item_name].discounted_price;
            invoice['total price'] = qty * products[item_name].discounted_price;
            invoice['total_price_in_rupees'] = invoice['total price'];
            previousOrderedItems.push(invoice);
            userOrderedItems[uname] = previousOrderedItems;
            logger.info(addRemoteIPToFileLogger(`User ordered items before adding current items : ${JSON.stringify(previousOrderedItems)}`,request.location.ip,path,method));
            logger.info(addRemoteIPToFileLogger(`Item :  ${item_name} has been placed successfully`,request.location.ip,path,method));
            return h.response(`${item_name} has been placed successfully`).code(200);
        },
        config : {
            validate : {
                payload : Joi.object(
                    {
                        itemname : Joi.string().min(4).max(25).required(),
                        quantity : Joi.number().min(1).max(4).required()
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
        handler : function(request,h){

            let authHeader = request.headers['authorization'],path = '/getordereditems',method = request.method;
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
            // console.log('Username after decoding from token : ',resp['uname']);
            let uname = resp['uname'];
            if(userOrderedItems[uname] == undefined){
                userOrderedItems[uname] = [];
            }
            logger.info(addRemoteIPToFileLogger(`Successfully responded with the ordered details to the user ${JSON.stringify(userOrderedItems[uname])}`,request.location.ip,path,method));
            return h.response(userOrderedItems[uname]).code(200);
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
        path : '/userlogs',
        handler : function(request,h){
            let authHeader = request.headers['authorization'],method = 'GET',path ='/userlogs';
            if(authHeader == undefined){
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
            if(typeof resp != 'object'){
                return h.response(resp).code(401);
            }
            let uname = resp['uname'];
            if(admin_user_list.includes(uname)){
                let query_params = request.query,searchusername = query_params['username'];
                return h.response(logs[searchusername]).code(200);
            }
            else{
                return h.response('User isn\'t admin So unable to perform the action').code(401);
            }
            // let query_params = request.query,uname = query_params['username'];
            // return h.response(logs[uname]).code(200);
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
        method : 'POST',
        path : '/product/outofstock',
        handler : function(request,h){
            let authHeader = request.headers['authorization'],method = 'POST',path = '/product/outofstock';
            if(authHeader == undefined){
                return h.response('Header missing in the request').code(401);
            }
            let token = authHeader.replace('Bearer ',''),resp = tokenValidator(token,request.location.ip,path,method);
            console.log('Resp after token validation : ',resp);
            if(typeof resp != 'object'){
                return h.response(resp).code(401);
            }
            // console.log('Response received : ',resp);
            // console.log('Username after decoding from token : ',resp['uname']);
            let uname = resp.uname;
            if(admin_user_list.includes(uname)){
                let payload = JSON.parse(request.payload),item_name = payload['item name'];
                console.log(payload);
                console.log(uname);
                console.log(uname in active_user_list);
                if(uname == undefined || uname == '' || !(uname in active_user_list)){
                    return h.response('kindly provide valid username in request payload').code(400);
                }
                else{
                        if(products[item_name] == undefined){
                            return h.response('kindly provide valid item name in request payload').code(400);
                        }
                        else{
                            products[item_name]['Out_of_stock'] = true;
                            return h.response(`Item ${item_name} moved to Out Of Stock`).code(200);
                        }
                }
            }
            else{
                return h.response('User isn\'t admin So unable to perform the action').code(401);
            }
            // for(const [key,value] of Object.entries(active_user_list)){
            //     obj[key] = value.getPassword();
            // }
            // return h.response(obj).code(200);
        }
    },
    {
        method : 'POST',
        path : '/makeuseradmin',
        handler : async function(request,h){
            let queryparams = request.query,uname = queryparams['username'],method = 'POST',path = '/makeuseradmin',resp = {}, status = 200;
            resp.msg = 'User will be made as admin in few secs ';

            await User.findOne({where : { USERNAME : uname }}).then((result) => {
                if(result == null){
                    resp.msg = 'Invalid username provided';
                    logger.error(addRemoteIPToFileLogger('Invalid username provided',request.location.ip,path,method));
                    status = 400;
                    // return h.response(resp).code(status);
                }
                else{
                    console.log(result.USER_ID, ' *********** ',result.IS_ADMIN);
                    if(result.IS_ADMIN == true){
                        resp.msg = `Mentioned username : ${uname} is already an Admin`;
                        status = 200;
                    }
                    else{
                        console.log('A########D');
                        User.update({
                            IS_ADMIN : true
                        },
                        {
                            where : {
                                USER_ID : result.USER_ID
                            }
                        }).then(result => {
                                console.log(result);
                                resp.msg = `Updated username : ${uname} as Admin`;
                                status = 200;
                            } 
                        ).catch(error => {
                            logger.error(addRemoteIPToFileLogger(`Error occurred while updating user as Admin : ${err}`,request.location.ip,path,method));
                        });
                        console.log('B########E');
                    }
                    // logger.info(addRemoteIPToFileLogger('Successfully logged into the account and Token provided in the response',request.location.ip,path,method));
                    // resp.token = token;
                }
            }).catch((err) => {
                // console.log('Error occurred while executing statement : ',err);
                logger.error(addRemoteIPToFileLogger(`Error occurred while finding user existence from DB  : ${err}`,request.location.ip,path,method));
            });
            return h.response(resp).code(status);

            // if(uname == undefined || uname == '' || !(uname in active_user_list)){
            //     console.log('Admin list : ',admin_user_list);
            //     return h.response('kindly provide valid username in request payload').code(400);
            // }
            // // else if(!(uname in active_user_list)){
            // //     console.log('Admin list : ',admin_user_list);
            // //     return h.response(`Mentioned username : ${uname} is invalid`).code(400);
            // // }
            // else{
            //     if(admin_user_list.includes(uname)){
            //         console.log('Admin list : ',admin_user_list);
            //         return h.response(`Mentioned username : ${uname} is already an Admin`).code(200);
            //     }
            //     else{
            //         admin_user_list.push(uname);
            //         console.log('Admin list : ',admin_user_list);
            //         return h.response(`Added user : ${uname} as Admin`).code(200);
            //     }
            // }
            // for(const [key,value] of Object.entries(active_user_list)){
            //     obj[key] = value.getPassword();
            // }
            // return h.response(obj).code(200);
        },
        config : {
            validate : {
                query : Joi.object({
                    username : Joi.string().min(4).max(10).required()
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
        handler : function(request,h){
            console.log('Path details : ',this.path);
            try{
                let query_params = request.payload,path = '/user/signup', method = request.method;
                let uname = query_params['username'],pwd = query_params['password'],email = query_params['email'];
                let headers = request.headers; 
                logger.debug(addRemoteIPToFileLogger(typeof headers,request.location,path,method));
                logger.debug(addRemoteIPToFileLogger(JSON.stringify(headers),request.location,path,method));
                // console.log(typeof query_params);
                console.log('IP Address :::: ',request.location.ip);
                logger.info(addRemoteIPToFileLogger('Inside POST sign up request with ',request.location.ip,path,method));
                logger.info(addRemoteIPToFileLogger(`Received values from request user name : ${uname} password : ${pwd} email : ${email}`,request.location.ip,path,method));
                if((uname == undefined || uname == "" ) || (pwd == undefined || pwd == "" ) || (email == undefined || email == "" )){
                    return h.response('Username, Password and Email id is a mandatory field kindly provide them').code(400);
                }
                if(registered_email_ids.includes(email)){
                    return h.response('Email ID provided is already being registered').code(400);
                }
                if(uname in active_user_list){
                    return h.response('User Name isn\'t available Kindly provide some other names').code(400);
                }
                console.log('Before Obj insertion----------');
                let obj = {};
                obj.uname = uname;
                obj.pwd = pwd;
                obj.fname = query_params['first_name'];
                obj.lname = query_params['last_name'];
                obj.email = email;
                obj.phone = query_params['phone'];
    
                let userObj = new user(obj);
                active_user_list[uname] = userObj;
                // console.log('Active user list : ',active_user_list);
                registered_email_ids.push(query_params['email']);
                console.log('Before DB insertion----------');
                let result = User.create({ FIRST_NAME : query_params['first_name'] , LAST_NAME : query_params['last_name'] , USERNAME : uname , PASSWORD : pwd, EMAIL : email, PHONE : query_params['phone'] });
                result.then((result) => {
                    console.log('User being stored in POSTGRESQL successfully customer : ',result);
                }).catch(err => {
                    console.log('Error occurred while executing statement : ',err);
                });
                // query_params.hostname = 'localhost'
                let ip_address = request.location;
                logger.debug(addRemoteIPToFileLogger(`User ip address : ${ip_address}`,request.location.ip,path,method));
                logs[uname] = loggingFunction.loggingTheActionToGlobalVariable('Successfully created account for the user',request.location.ip,logs[uname]);

                // let token = Jwt.token.generate(
                //     {
                //         aud: 'urn:audience:test',
                //         iss: 'urn:issuer:test',
                //         user: uname,
                //         pwd : query_params['password'],
                //         email : query_params['email'],
                //         group: 'hapi_community'
                //     },
                //     {
                //         key: 'topSecretKey_ToBePutInFileInProductionEnv',
                //         algorithm: 'HS512'
                //     },
                //     {
                //         ttlSec: 14400 // 4 hours
                //     });
                // let token = jwt.sign({ 
                //     user : uname,
                //     pwd : pwd,
                //     email : email
                // }, 'SECRET_KEY_ARUN');
                // console.log('Newly created token value is ',token);
                // let resp =  {};
                // // resp["token"] = token;
                // resp["msg = 'Successfully created account';
                logger.info(addRemoteIPToFileLogger(`Successfully created account with user name as : ${uname}`,request.location.ip,path,method));
                return h.response('Successfully created account').code(200);
            }
            catch(err){
                let errorObj = {};
                errorObj.error_message = err.message;
                errorObj.message = 'Unable to create account at this moment';
                logger.error(addRemoteIPToFileLogger(`Unable to create account at this moment with user name as : ${request.payload['username']}`,request.location,'/user/signup',request.method));
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
                                first_name : Joi.string().min(5).max(10).required(),
                                last_name : Joi.string().min(1).max(10),
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


// server.route({
//     method : 'GET',
//     path : '/findmyipaddress',
//     handler : function(request,h){
//         console.log('Finding ip related details using plugin : ', request.location);
//         const queryparams = request.query;
//         let uname = logs[queryparams['username']];
//         if(uname == undefined || uname == ''){
//             return h.response('Username param in query is mandatory for finding the IP Address').code(400);
//         }
//         // let loggerObj = loggingFunction.createLoggerObjForCurrentAction('User requested to find his IP Address',request.location);
//         // let logsArrayOfUser = loggingFunction.loggingTheActionToGlobalVariable('User requested to find his IP Address',request.location,logs[uname]);
//         // let userlogs = logs[queryparams['username']];
//         // if(userlogs == undefined){
//         //     userlogs  = [];          
//         // }
//         // userlogs.push(loggerObj);
//         logs[uname] = loggingFunction.loggingTheActionToGlobalVariable('User requested to find his IP Address',request.location,logs[uname]);
//         // console.log('complete logs : ',logs);
//         console.log('User log details : ',logs[uname]);
//         return h.response(request.location).code(200);
//     }
// })

// server.route({
//     method : 'GET',
//     path : '/user/signin',
//     handler : function(request,h){
//         let query_params = request.query,uname = query_params['username'],pwd = query_params['password'];
//         let msg;

//         if((uname == undefined || uname == "" ) || (pwd == undefined || pwd == "" ) ){
//                 msg = 'Username and password are mandatory field.Kindly provide them';
//                 if(uname != undefined && uname != ""){
//                     logs[uname] = loggingFunction.loggingTheActionToGlobalVariable('User provided empty password for signing into his account',request.location,logs[uname]);
//                 }
//                 return h.response(msg).code(400);
//         }

//         if(uname in active_user_list){
//             let userdetails = active_user_list[uname];
//             if(userdetails.getPassword() == pwd){
//                 msg = 'Successfully logged into the account';
//                 logs[uname] = loggingFunction.loggingTheActionToGlobalVariable(msg,request.location,logs[uname]);
//                 return h.response(msg).code(201);
//             }
//             else{
//                 msg = 'Entered password is wrong';
//                 logs[uname] = loggingFunction.loggingTheActionToGlobalVariable('User provided wrong password for signing into his account',request.location,logs[uname]);
//                 return h.response(msg).code(400);
//             }
//         }
//         else{
//                 msg = 'Mentioned username is improper';
//                 return h.response(msg).code(400);
//         }

//     }
// })
// This API is for ***** INTERNAL PURPOSE ****** 
// server.route({
//     method : 'GET',
//     path : '/users',
//     handler : function(request,h){
//             let obj = {};
//             for(const [key,value] of Object.entries(active_user_list)){
//                obj[key] = value.getPassword();
//             }
//             return h.response(obj).code(200);
//         }

//     })


// WORKING IN V16.0.0 OF HAPI JS BUT NOT IN V18.0.0 
// const server = new Hapi.Server({
//     host : 'localhost',
//     port : 3000
// })

// server.({
//     host : 'localhost',
//     port : 3000
// })

// server.route(){

// }


// server.route({
//     method : 'POST',
//     path : '/user/signup',
//     handler : function(request,h){

//         try{
//             let query_params = JSON.parse(request.payload);
//             // console.log(typeof query_params);

//             if((query_params['username'] == undefined || query_params['username'] == "" ) || (query_params['password'] == undefined || query_params['password'] == "" ) || (query_params['email'] == undefined || query_params['email'] == "" )){
//                 return h.response('Username, Password and Email id is a mandatory field kindly provide them').code(400);
//             }
//             if(registered_email_ids.includes(query_params['email'])){
//                 return h.response('Email ID provided is already being registered').code(400);
//             }
//             if(query_params['username'] in active_user_list){
//                 return h.response('User Name isn\'t available Kindly provide some other names').code(400);
//             }

//             let obj = {},uname = query_params['username'];
//             obj.uname = query_params['username'];
//             obj.pwd = query_params['password'];
//             obj.fname = query_params['first_name'];
//             obj.lname = query_params['last_name'];
//             obj.email = query_params['email'];
//             obj.phone = query_params['phone'];

//             let userObj = new user(obj);
//             active_user_list[uname] = userObj;
//             // console.log('Active user list : ',active_user_list);
//             registered_email_ids.push(query_params['email']);
//             // query_params.hostname = 'localhost'
//             let ip_address = request.location;
//             console.log('User ip address : ',ip_address);
//             logs[uname] = loggingFunction.loggingTheActionToGlobalVariable('Successfully created account for the user',request.location,logs[uname]);
//             return h.response('Successfully created account').code(200);
//         }
//         catch(err){
//             let errorObj = {};
//             errorObj.error_message = err.message;
//             errorObj.message = 'Unable to create account at this moment';
//             return h.response(errorObj).code(500);
//         }
//     }
// })

// FROM V17 ONWARDS THE SERVER WILL IGNORE THE CALLBACK FUNCTIONS BEING PRESENT SO THAT THE LINES INSIDE IT WON'T GET EXECUTED
// server.start(function(err){
//     if(err){
//         throw err
//     }
//     console.log('Server started');
//     console.log('Info about the server : ',server.info);
//     console.log('URI to access the server : ',server.info.uri);
// })