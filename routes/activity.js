'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var http = require('https');

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path, 
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {

    console.log("5 -- For Edit");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
    //console.log("Edited: "+req.body.inArguments[0]);    
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    
    console.log("5 -- For Save");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
    //console.log("Saved: "+req.body.inArguments[0]);
    
    // Data from the req and put it in an array accessible to the main app.
    console.log( req.body );
    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = async function (req, res) {
     console.log('Executing');
     //console.log("Executed: "+req.body.inArguments[0]);
    
    var requestBody = req.body.inArguments[0];
    // const to = requestBody.to;


     const marketCode = requestBody.marketCode;
     const brandName = requestBody.brandName;
     const scenarioId = requestBody.scenarioId;
     const hcpId = requestBody.hcpId;

     console.log('marketCode is ', marketCode);
     console.log('brandName is ', brandName);
     console.log('scenarioId is ', scenarioId);
     console.log('hcpId is ', hcpId);

     const formData = {
         hcpId: hcpId,
         marketCode: marketCode,
         scenarioId: scenarioId,
         brandName: brandName
     }
     console.log('Form data is ', JSON.stringify(formData));

    const externalKey = '3C29AFDE-EFD1-4469-9638-C98E5EB95695';
    const awsUrl = 'https://r7xy19uipg.execute-api.eu-west-1.amazonaws.com/dev';
    const accessUrl = 'https://mcxk3jwz79lcp1qf21j7hmh18z3m.auth.marketingcloudapis.com/v2/token';
    const restUrl = `https://mcxk3jwz79lcp1qf21j7hmh18z3m.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:${externalKey}/rows/`;
    /* const formData = {
        "hcpId": "123jdj",
       "scenarioId": "qwe",
       "marketCode": "hhd",
       "brandName": "anfknf"
    }*/
    const finalFormData = {
        "items": [{
           "hcpId":"1234",
           "marketCode" : "Jones",
           "scenarioId": "23456",
           "ID": "112",
           "status": "Success",
           "brandName": "Nike"
        }]
     };
    const awsApiData = JSON.stringify(formData);
    const awsApiOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: awsApiData
    };
    const accessUrlOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "grant_type": "client_credentials",
            "client_id": "1jwrskb8tqp4wn2y5eiebh6g",
            "client_secret": "4xYx8fpQxO4dLSa6TXBPtccF",
            "account_id": "536005973"
        })
    }
    await fetch(awsUrl, awsApiOptions)
    .then(data => data.json())
    .then(async (result) => {
        console.log('aws api response', result);
        await fetch(accessUrl,accessUrlOptions)
        .then(data => data.json())
        .then(async (result) => {
            console.log('acess api response', result)
            // formData["ID"]="112";
            // formData["status"]="success";
            await fetch(restUrl,{
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${result.access_token}`,
                    'Content-Type':'application/json'
                },
                // body: JSON.stringify(formData),
                body: JSON.stringify(finalFormData)
                // redirect: "follow"
            })
            .then(res => res.json())
            .then(result => {
                console.log('Final form data is ', JSON.stringify(finalFormData));
                console.log('Final result is ', result);
            });
        })
    });
    logData(req);
    res.send(200, 'Execute');
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {

    console.log("5 -- For Publish");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
    //console.log("Published: "+req.body.inArguments[0]);        
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {

    console.log("5 -- For Validate");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
    //console.log("Validated: "+req.body.inArguments[0]);       
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Validate');
};