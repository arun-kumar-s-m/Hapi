const Hapi = require('hapi'),user = require('./User'),loggingFunction = require('./helperfunctions.js')

const categoryWithSubCategories = {};
categoryWithSubCategories['electronics'] = {};
categoryWithSubCategories['electronics']['pendrives'] = ['hp_64_gb','sandish_64_gb','transcend_64_gb'];
categoryWithSubCategories['electronics']['phones'] = ['iphone14','oneplus10','samsung galaxy Z1 ultra'];
categoryWithSubCategories['clothes'] = {};
categoryWithSubCategories['clothes']['tshirts'] = ['tshirt A','tshirt B','tshirt C'];
categoryWithSubCategories['clothes']['jeans'] = ['jean A','jean B','jean C'];

const products = {
    'jean A' : {
        name : 'jean A',
        available_sizes : '32,34,36,38',
        price_in_Rs : 1000,
        discounted_price : 900
    },
    'jean B' : {
        name : 'jean B',
        available_sizes : '32,34',
        price_in_Rs : 1200,
        discounted_price : 1150
    },
    'jean C' : {
        name : 'jean C',
        available_sizes : '36,38',
        price_in_Rs : 15000,
        discounted_price : 1300
    },
    'tshirt A' : {
        name : 'tshirt A',
        available_sizes : '38,40,42,44',
        price_in_Rs : 500,
        discounted_price : 450
    },
    'tshirt B' : {
        name : 'tshirt B',
        available_sizes : '40,42,44',
        price_in_Rs : 400,
        discounted_price : 380
    },
    'tshirt C' : {
        name : 'tshirt C',
        available_sizes : '38,42,44',
        price_in_Rs : 200,
        discounted_price : 190
    },
    'iphone14' : {
        name : 'iPhone 14 3GB RAM, 128GB internal',
        price_in_Rs : 60000,
        discounted_price : 55000
    },
    'oneplus10' : {
        name : 'OnePlus 10 8GB RAM, 128GB internal',
        price_in_Rs : 40000,
        discounted_price : 33000
    },
    'samsung galaxy Z1 ultra' : {
        name : 'Samsung Galaxy Z1 Ultra 12GB RAM, 256GB internal',
        price_in_Rs : 70000,
        discounted_price : 66000
    },
    'hp_64_gb' : {
        name : 'HP 64 GB Pendrive',
        price_in_Rs : 400,
        discounted_price : 350
    },
    'sandish_64_gb' : {
        name : 'Sandisk 64 GB Pendrive',
        price_in_Rs : 200,
        discounted_price : 150
    },
    'transcend_64_gb' : {
        name : 'Transcend 64 GB Pendrive',
        price_in_Rs : 300,
        discounted_price : 250
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
let active_user_list = {},registered_email_ids = [],logs = {},userCartDetails = {},userOrderedItems = [];

const init = async () => {

    // server = Hapi.server({
    //     port: 3000,
    //     host: 'localhost'
    // });
    await server.start();
    await server.register(require('hapi-geo-locate',(err) => {
            if(err){
                throw err
            }
        }
    
    ));
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
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

server.route(
    [{
        method : 'GET',
        path : '/',
        handler : function(request,reply){
            return 'Arun started Hapi framework';
        }
    },
    {
        method : 'GET',
        path : '/getAllProducts',
        handler : function(request,h){
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
        path : '/addtocart',
        handler : function(request,h){
            let itemToAddToCart = JSON.parse(request.payload),item_name = itemToAddToCart['item name'],uname = itemToAddToCart['username'];
            if(item_name == undefined || item_name == ''){
                return h.response('Kindly provide valid item name to add to Cart').code(400);
            }
            else if(products[item_name] == undefined){
                return h.response('Mentioned item name isn\'t valid.Kindly provide valid item name').code(400);
            }
            else{
                if(uname == undefined || uname == '' || !(uname in active_user_list)){
                    return h.response('Kindly provide username in the query params to add the item to his cart').code(400);
                }
                else if(!(uname in active_user_list)){
                    return h.response('Mentioned username isn\'t valid Kindly provide valid username').code(400);
                }
                else{
                    let userCart = userCartDetails[uname];
                    if(userCart == undefined){
                        userCart = [];
                    }
                    userCart.push(item_name);
                    userCartDetails[uname] = userCart;
                    let msg = `Item : ${item_name} successfully added to cart`;
                    logs[uname] = loggingFunction.loggingTheActionToGlobalVariable(msg,request.location,logs[uname]);
                    return h.response(msg).code(200);
                }
            }

        }
    },
    {
        method : 'GET',
        path : '/getcart',
        handler : function(request,h){
            let uname = request.query['username'];
            if(uname == undefined || uname == ''){
                return h.response('Kindly provide username to get his cart details').code(400);
            }
            else if(!(uname in active_user_list)){
                return h.response('Mentioned user isn\'t a valid user Kindly provide valid value for username param ').code(400);
            }
            else{
                let cartDetils = userCartDetails[uname],obj={};
                obj.userCart = cartDetils;
                logs[uname] = loggingFunction.loggingTheActionToGlobalVariable('user accessing cart',request.location,logs[uname]);
                console.log('User log details : ',logs[uname]);
                return h.response(obj).code(200);
            }
        }
    },
    {
        method : 'POST',
        path : '/getcart/buy',
        handler : function(request,h){
            let payload = JSON.parse(request.payload),uname = payload['username'],itemsAndQuantities = payload['items'];
            let invoice = {};
            if(uname == undefined || uname == '' || !(uname in active_user_list)){
                return h.response('kindly provide valid username in request payload').code(400);
            }
            let total_price_of_ordered_items =  0;
            for(const [key,value] of Object.entries(itemsAndQuantities)){
                if(!(key in products)){
                    return h.response(`Invalid item name : ${key} being passed`).code(400);
                }
                let quantity = Number(value);
                console.log('QUANTITY : ',quantity);
                if(isNaN(quantity)){
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
            if(userAlreadyOrderedItems == undefined){
                userAlreadyOrderedItems = [];
            }
            userAlreadyOrderedItems.push(invoice);
            userOrderedItems[uname] = userAlreadyOrderedItems;
            logs[uname] = loggingFunction.loggingTheActionToGlobalVariable(`User placed an order`,request.location,logs[uname]);
            return h.response('Items has been placed successfully').code(200);
        }
    },
    {
        method : 'POST',
        path : '/buy',
        handler : function(request,h){
            let payload = JSON.parse(request.payload),uname = payload['username'],item_name = payload['item name'],qty = payload['quantity'];
            let invoice = {};
            if(uname == undefined || uname == '' || !(uname in active_user_list)){
                return h.response('kindly provide valid username in request payload').code(400);
            }
            if(!(item_name in products)){
                return h.response('Item name is invalid.Kindly mention it properly').code(400);
            }
            let previousOrderedItems = userOrderedItems[uname];
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
            return h.response(`${item_name} has been placed successfully`).code(200);
        }
    },
    {
        method : 'GET',
        path : '/getordereditems',
        handler : function(request,h){
            let uname = request.query["username"];
            if(userOrderedItems[uname] == undefined){
                userOrderedItems[uname] = [];
            }
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
            let query_params = request.query,uname = query_params['username'];
            return h.response(logs[uname]).code(200);
        }
    },
    {
        method : 'GET',
        path : '/user/signin',
        handler : function(request,h){
            let query_params = request.query,uname = query_params['username'],pwd = query_params['password'];
            let msg;
    
            if((uname == undefined || uname == "" ) || (pwd == undefined || pwd == "" ) ){
                    msg = 'Username and password are mandatory field.Kindly provide them';
                    if(uname != undefined && uname != ""){
                        logs[uname] = loggingFunction.loggingTheActionToGlobalVariable('User provided empty password for signing into his account',request.location,logs[uname]);
                        console.log('Inside GET sign in request',logs[uname]);
                    }
                    return h.response(msg).code(400);
            }
    
            if(uname in active_user_list){
                let userdetails = active_user_list[uname];
                if(userdetails.getPassword() == pwd){
                    msg = 'Successfully logged into the account';
                    logs[uname] = loggingFunction.loggingTheActionToGlobalVariable(msg,request.location,logs[uname]);
                    console.log('Inside GET sign in request',logs[uname]);
                    return h.response(msg).code(201);
                }
                else{
                    msg = 'Entered password is wrong';
                    logs[uname] = loggingFunction.loggingTheActionToGlobalVariable('User provided wrong password for signing into his account',request.location,logs[uname]);
                    console.log('Inside GET sign in request',logs[uname]);
                    return h.response(msg).code(400);
                }
            }
            else{
                    msg = 'Mentioned username is improper';
                    console.log('Inside GET sign in request',logs[uname]);
                    return h.response(msg).code(400);
            }
    
        }
    },
    {
        method : 'GET',
        path : '/users',
        handler : function(request,h){
            let obj = {};
            for(const [key,value] of Object.entries(active_user_list)){
                obj[key] = value.getPassword();
            }
            return h.response(obj).code(200);
        }
    
    },
    {
        method : ['POST','PUT'],
        path : '/user/signup',
        handler : function(request,h){
    
            try{
                let query_params = JSON.parse(request.payload);
                // console.log(typeof query_params);
    
                if((query_params['username'] == undefined || query_params['username'] == "" ) || (query_params['password'] == undefined || query_params['password'] == "" ) || (query_params['email'] == undefined || query_params['email'] == "" )){
                    return h.response('Username, Password and Email id is a mandatory field kindly provide them').code(400);
                }
                if(registered_email_ids.includes(query_params['email'])){
                    return h.response('Email ID provided is already being registered').code(400);
                }
                if(query_params['username'] in active_user_list){
                    return h.response('User Name isn\'t available Kindly provide some other names').code(400);
                }
    
                let obj = {},uname = query_params['username'];
                obj.uname = query_params['username'];
                obj.pwd = query_params['password'];
                obj.fname = query_params['first_name'];
                obj.lname = query_params['last_name'];
                obj.email = query_params['email'];
                obj.phone = query_params['phone'];
    
                let userObj = new user(obj);
                active_user_list[uname] = userObj;
                // console.log('Active user list : ',active_user_list);
                registered_email_ids.push(query_params['email']);
                // query_params.hostname = 'localhost'
                let ip_address = request.location;
                console.log('User ip address : ',ip_address);
                logs[uname] = loggingFunction.loggingTheActionToGlobalVariable('Successfully created account for the user',request.location,logs[uname]);
                console.log('Inside POST sign up request',logs[uname]);
                return h.response('Successfully created account').code(200);
            }
            catch(err){
                let errorObj = {};
                errorObj.error_message = err.message;
                errorObj.message = 'Unable to create account at this moment';
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
                     ONLY WHEN USERNAME and EMAIL address provided in payload is unique then the request will be successful`
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