const fs = require('fs');
const path = require('path');

let lib = {};

lib.baseDir = path.join(__dirname,'/../.data/');

lib.create = function(dir,file,data,callback) {
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDesriptor,callback) {
        if(!err && fileDesriptor) {
            let stringData = JSON.stringify(data);
            fs.writeFile(fileDesriptor,stringData,function(err,callback) {
                if(!err) {

                    fs.close(fileDesriptor,function(err,callback) {
                        if(!err) {
                            return false;
                        }
                        else {
                            callback('Error in cclosing file: '+err);
                        }
                    });
                }
                else {
                    callback('Error in writing to new file: '+err);
                }
            });
        }
        else {
            callback('could not create new file: '+err);
        }
    });
};


lib.read = function(dir,file,callback) {
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data) {
        callback(err,data);
    });
};

lib.update = function(dir,file,data,callback) {
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDesriptor) {
        if(!err && fileDesriptor) {
            let stringData = JSON.stringify(data);

            fs.truncate(fileDesriptor,function(err,callback) {
                if(!err) {
                    fs.writeFile(fileDesriptor,stringData,function(err,callback) {
                        if(!err) {
                            fs.close(fileDesriptor,function(err,callback) {
                                if(!err) {
                                    return false;
                                }
                                else {
                                    callback('Error in closing file: '+err);
                                }
                            });
                        }
                        else {
                            callback('Error in update file: '+err);
                        }
                    });
                }
                else {
                    callback('Error in truncate file: '+err);
                }
            });
        }
        else {
            callback('Error opening file: '+err);
        }
    });
};

lib.delete = function(dir,file,callback) {

    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err) {
        if(!err){
            callback(false);
        }
        else {
            callback('error in delete: '+err);
        }
    });
};


module.exports = lib;

