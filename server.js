const Hapi = require('hapi'),user = require('./User')

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
let active_user_list = {},registered_email_ids = [];

const init = async () => {

    // server = Hapi.server({
    //     port: 3000,
    //     host: 'localhost'
    // });

    await server.start();
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

server.route({
    method : 'GET',
    path : '/',
    handler : function(request,reply){
        return 'Arun started Hapi framework';
    }
})

server.route({
    method : 'GET',
    path : '/user/signin',
    handler : function(request,reply){
        // console.log('query from request is : ',request.query);
        let query_params = request.query,uname = query_params['username'],pwd = query_params['password'];
        // console.log('name == ',uname,'pwd == ',pwd);
        // console.log(query_params);
        // console.log(typeof query_params);

        if((query_params['username'] == undefined || query_params['username'] == "" ) || (query_params['password'] == undefined || query_params['password'] == "" ) ){
            return 'Username and password are mandatory field.Kindly provide them';
        }

        if(uname in active_user_list){
            let userdetails = active_user_list[uname];
            let ppw = userdetails.getPassword();
            // console.log('Password stored in cache ',ppw , ' and its type is : ',typeof ppw);
            if(userdetails.getPassword() == pwd){
                return 'Successfully logged into the account';
            }
            else{
                return 'Entered password is wrong';
            }
        }
        else{
            return 'Mentioned username is improper';
        }

    }
})

init();

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


server.route({
    method : 'POST',
    path : '/user/signup',
    handler : function(request,reply){

        try{
            let query_params = JSON.parse(request.payload);
            // console.log(typeof query_params);

            if((query_params['username'] == undefined || query_params['username'] == "" ) || (query_params['password'] == undefined || query_params['password'] == "" ) || (query_params['email'] == undefined || query_params['email'] == "" )){
                return 'Username, Password and Email id is a mandatory field kindly provide them'
            }
            if(registered_email_ids.includes(query_params['email'])){
                return 'Email ID provided is already being registered';
            }
            if(query_params['username'] in active_user_list){
                return 'User Name isn\'t available Kindly provide some other names';
            }

            let obj = {};
            obj.uname = query_params['username'];
            obj.pwd = query_params['password'];
            obj.fname = query_params['first_name'];
            obj.lname = query_params['last_name'];
            obj.email = query_params['email'];
            obj.phone = query_params['phone'];

            let userObj = new user(obj);
            active_user_list[query_params['username']] = userObj;
            // console.log('Active user list : ',active_user_list);
            registered_email_ids.push(query_params['email']);
            // query_params.hostname = 'localhost'
            return 'Successfully created account';
        }
        catch(err){
            let errorObj = {};
            errorObj.error_message = err.message;
            errorObj.message = 'Unable to create account at this moment';
            return errorObj;
        }
    }
})

// FROM V17 ONWARDS THE SERVER WILL IGNORE THE CALLBACK FUNCTIONS BEING PRESENT SO THAT THE LINES INSIDE IT WON'T GET EXECUTED
// server.start(function(err){
//     if(err){
//         throw err
//     }
//     console.log('Server started');
//     console.log('Info about the server : ',server.info);
//     console.log('URI to access the server : ',server.info.uri);
// })