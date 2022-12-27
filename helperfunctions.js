function createLoggerObjForCurrentAction(msg,ip_details){
    let obj = {};
    obj['action_performed'] = msg;
    obj['remote_ip_address'] = ip_details;
    obj['timestamp'] = new Date();
    return obj;
}

function loggingTheActionToGlobalVariable(msg,locationObj,userlogs){
    let logobj = createLoggerObjForCurrentAction(msg,locationObj);
    if(userlogs == undefined){
        userlogs  = [];          
    }
    userlogs.push(logobj);
    return userlogs;
}
exports.loggingTheActionToGlobalVariable = loggingTheActionToGlobalVariable;