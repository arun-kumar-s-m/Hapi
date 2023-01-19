const {createLogger,format,transports} = require('winston');
const {timestamp,combine,printf,errors} = format;
let logger = null;

// function devLogger(){

//     const logFormat = printf(({level, message, timestamp, stack}) => {
//         return `TIMESTAMP : ${timestamp} LOGLEVEL : ${level} MESSAGE : ${ stack || message}`;
//     }); 
//     return createLogger({
//         level : 'debug',
//         format : combine(
//             timestamp({ format : 'YYYY-MM-DD HH:mm:ss'}),
//             format.errors({stack : true}),
//             logFormat
//         ),
//         transports : [
//             new transports.Console()
//         ],
//     });

// }

// function productionLogger(){

//    return createLogger({
//         format : combine(
//             timestamp(),
//             errors({stack : true})
//         ),
//         defaultMeta : { service : 'user-service'},
//         transports : [
//             new transports.Console()
//         ],
//     });

// }

const myformat = printf(({level , message , timestamp, ...metadata}) => {
    let remoteIPAddress = metadata['Remote IP Address'],path = metadata['Path'];
    if(path == undefined && remoteIPAddress == undefined){
        return `${timestamp} [${level.toUpperCase()}] ${message}`;
    }
    else{
        return `${timestamp} [${level.toUpperCase()}] ${remoteIPAddress} ${metadata['Method']} ${path} ${message}`;
    }
})

if(process.env.NODE_ENV == 'production'){
    logger = createLogger({
        level : 'info',
        format : combine(
            timestamp(),
            myformat
        ),
        transports : [
            new transports.File({filename : 'productionerror.log'})
        ]
    })
}

module.exports = logger;