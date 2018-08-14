const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
//const _data = require('./lib/data');
const helpers = require('./lib/helpers');
const handlers = require('./lib/handlers');


//_data.delete('test','newFile',function(err,data) {
//        console.log('this is the error'+err);
//});

let httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert':fs.readFileSync('./https/cert.pem')
};

//Instaniating the server
const httpServer = http.createServer(function(req,res) {
    unifiedServer(req,res);
});

const httpsServer = https.createServer(httpsServerOptions,function(req,res) {
    unifiedServer(req,res);
});

httpServer.listen(config.httpPort,function() {
    console.log(`server listening on port ${config.httpPort} now on ${config.envName}`);
});

httpsServer.listen(config.httpsPort,function() {
    console.log(`server listening on port ${config.httpsPort} now on ${config.envName}`);
})


const unifiedServer = function(req,res) {
    //parse the url
    const parsedUrl = url.parse(req.url,true);

    //get the path form parsed url
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/$/g,''); 

    //get the querystring as on object
    let queryStringObject = parsedUrl.query;

    //get requested method
    const method = req.method.toLowerCase();

    //get headers object form req
    const headers = req.headers;

    const decoder = new stringDecoder('utf-8');
    let buffer = '';

    req.on('data',function(data) {
        buffer += decoder.write(data);
    });

    req.on('end',function() {
        buffer += decoder.end();

        let choseHandler = router[trimmedPath] !== undefined ? router[trimmedPath] : handlers.notFound;

        let data = {
            'trimmedPath':trimmedPath,
            'headers':headers,
            'method':method,
            'queryString':queryStringObject,
            'payload':helpers.parseToJsonObject(buffer)
        };

        choseHandler(data,function(statudCode,payload) {
            statudCode = typeof(statudCode) == 'number' ? statudCode : 200 ; 
            payload = typeof(payload) == 'object' ? payload :  {};

            let payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type','application/json');
            res.writeHead(statudCode);
            res.end(payloadString); 
            //log the request
            console.log('request payload ', statudCode, payloadString);
        });
    });

    let router = {
        "sample": handlers.sample,
        "ping":handlers.ping,
        "users":handlers.users
    };
};
