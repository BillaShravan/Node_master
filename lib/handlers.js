let _data = require('./data');
let helpers = require('./helpers');
let handlers = {};

    handlers.sample = function(data,callback) {
        callback(406,data);
    };

    handlers.ping = function(data,callback) {
        callback(200);
    }

    handlers.notFound = function(data,callback) {
        callback(404);
    };

    //users handlers
    handlers.users = function(data,callback) {
        let acceptableMethods = ['get','post','put','delete'];
        if(acceptableMethods.indexOf(data.method) > -1){
            handlers._users[data.method](data,callback);
        }
        else{
            callback(405);
        }
    };

    //containers for _users handlers
    handlers._users = {};

    //users post
    handlers._users.post = function(data,callback) {
        //firstname,lastname,phone,pwd,tosAgreement
        let firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length>0 ? data.payload.firstName : false ;
        let lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length>0 ? data.payload.lastName : false ;
        let phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length>10 ? data.payload.phone : false ;
        let password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length>0 ? data.payload.password : false ;
        let tosAgreement = typeof(data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement===true ? data.payload.tosAgreement : false ;

        if(firstName && lastName && phone && password && tosAgreement){
            //Make sure users already exist
            _data.read('users',phone,function(err,data) {
                if(err){
                    //Hash the pwd
                    let hashPwd = helpers.hash(password);
                    //create users object
                    let userObject = {
                        'firstName':firstName,
                        'lastName':lastName,
                        'phone':phone,
                        'password':hashPwd,
                        'tosAgreement' : true
                    };


                    _data.create('users',phone,userObject,function(err,callback) {
                        if(!err){
                            callback(200);
                        }else{
                            console.log(err);
                            callback(500,{'Error':'Could not create user'});
                        }
                    });

                }
                else{
                    callback(400,{'Error':'User with phone already exist'});
                }
            });
        }
        else{
            callback(400,{'Error' : 'Missing required fields'});
        }
    };

    //users get
    handlers._users.get = function(data,callback) {
        let phone = typeof(data.queryString.phone) === 'string' && data.queryString.phone.length>10 ? data.queryString.phone.trim() : false; 
        if(phone){
            _data.read('users',phone,function(err,data) {
                if(!err){
                    data = helpers.parseToJsonObject(data);
                    callback(200,data);
                }else{
                    callback(404);
                }
            });
        } 
        else{
            callback(405);
        }

    };

    //users put
    handlers._users.put = function(data,callback) {
        let phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length>10 ? data.payload.phone : false ;

        let firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length>0 ? data.payload.firstName : false ;
        let lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length>0 ? data.payload.lastName : false ;
        let password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length>0 ? data.payload.password : false ;

        if(phone){
            if(firstName || lastName || password) {
                _data.read('users',phone,function(err,userData) {
                    if(!err && userData){
                        userData = helpers.parseToJsonObject(userData);
                        if(firstName){
                            userData.firstName = firstName;
                        }
                        if(lastName){
                            userData.lastName = lastName;
                        }
                        if(password){
                            userData.password = helpers.hash(password);
                        }

                        _data.update('users',phone,userData,function(err,callback){
                            if(!err){
                                callback(200);
                            }else{
                                callback(500,{'Error':'Error in updating user'})
                            }
                        });
                        
                    }
                    else{
                        callback(400,{'Error':'Data not available'});
                    }
                });
            }
            else{
                callback(404,{'Error':'Missing fields for update'});
            }
        }
        else{
            callback(404,{'Error':'Missing required fields'});
        }


    };

    //users delete
    handlers._users.delete = function(data,callback) {
        let phone = typeof(data.queryString.phone) === 'string' && data.queryString.phone.length>10 ? data.queryString.phone.trim() : false; 
        if(phone){
            _data.delete('users',phone,function(err) {
                if(!err){
                    callback(200);
                }else{
                    callback(400,{'Error':'Culd not delete specified user'});
                }
            });
        } 
        else{
            callback(400,{'Error':'Missing required field'});
        }
    };

    //export module
    module.exports = handlers;