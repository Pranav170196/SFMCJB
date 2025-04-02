'use strict';
var util = require('util');
var axios = require('axios');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var http = require('https');
//const AccessToken = require('twilio/lib/jwt/AccessToken');

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
    // console.log("body: " + util.inspect(req.body));
    // console.log("headers: " + req.headers);
    // console.log("trailers: " + req.trailers);
    // console.log("method: " + req.method);
    // console.log("url: " + req.url);
    // console.log("params: " + util.inspect(req.params));
    // console.log("query: " + util.inspect(req.query));
    // console.log("route: " + req.route);
    // console.log("cookies: " + req.cookies);
    // console.log("ip: " + req.ip);
    // console.log("path: " + req.path);
    // console.log("host: " + req.host);
    // console.log("fresh: " + req.fresh);
    // console.log("stale: " + req.stale);
    // console.log("protocol: " + req.protocol);
    // console.log("secure: " + req.secure);
    // console.log("originalUrl: " + req.originalUrl);
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
    
    // var requestBody = req.body.inArguments[0];
    // const to = requestBody.to;


    //  const ContactID = requestBody.ContactID;
    //  const FirstName = requestBody.FirstName;
    //  const LastName = requestBody.LastName;
    //  const EmailAddress = requestBody.EmailAddress;
  



    //    const formData = {
    //     ContactID: ContactID,
    //     FirstName: FirstName,
    //     LastName: LastName,
    //     EmailAddress: EmailAddress
 
    //  }
    

    //const externalKey = '3C29AFDE-EFD1-4469-9638-C98E5EB95695';
    
    let externalKey_Source = '1B634897-BB9A-4910-840A-437E00EFA081';
    let externalKey_Target = '8EE09EDD-22AE-4AD1-9290-E14B24175795';

    let accessUrl = 'https://mc4by0xw84s11pznjgq1c45n7qr0.auth.marketingcloudapis.com/v2/token';
    let detoken = `https://mc4by0xw84s11pznjgq1c45n7qr0.rest.marketingcloudapis.com/data/v1/customobjectdata/key/${externalKey_Source}/rowset`
    let pushDeTokenURL = `https://mc4by0xw84s11pznjgq1c45n7qr0.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:${externalKey_Target}/rows`
    // let restUrl = `https://mc4by0xw84s11pznjgq1c45n7qr0.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:${externalKey_Target}/rows/`
    

    // const newFormData = formData;

    async function getAccessToken() {
        try {
            const response = await axios.post(accessUrl, {
                "grant_type": "client_credentials",
                "client_id": "7svddz3sf4jllv40lqnffolh",
                "client_secret": "ZfxbkAqcrbMnrXXBKyqIT08H",
                "account_id": "7236752"
            })
            console.log("Access token", response.data.access_token)
            const accessToken = response.data.access_token
            await fetchDEToken(accessToken)
     
        } catch(err) {
            console.error('Error while fetching API')
        }
    }

    async function fetchDEToken(accessToken) {
        try {
            const response = await axios.get(detoken, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            })
            console.log("DE Fetch Request Token: ", response.data.requestToken)
            let deReqToken = response.data.requestToken
            await fetchDEData(deReqToken,accessToken)
        }
        catch(err) {
            console.error('Error while fetching: DE Fetch Request Token')
            // if (err.response) {
            //     // The request was made and the server responded with a status code
            //     // that falls out of the range of 2xx
            //     console.error('Response data:', err.response.data);
            //     console.error('Response status:', err.response.status);
            //     console.error('Response headers:', err.response.headers);
            // } else if (err.request) {
            //     // The request was made but no response was received
            //     console.error('Request data:', err.request);
            // } else {
            //     // Something happened in setting up the request that triggered an Error
            //     console.error('Error message:', err.message);
            // }
     
        }
    }

    await getAccessToken()
    
     

    async function pushDERecord(accessToken,dataPayload) {
        const itemsPayload = { items: [] };

        const iterateOverItems = (data) => {
            data.items.forEach(item => {
                const newItem = {}; // Create a new object for each item
        
               // console.log('Keys:');
                for (const [key, value] of Object.entries(item.keys)) {
                    newItem[key] = value;
                }
        
                //console.log('Values:');
                for (const [key, value] of Object.entries(item.values)) {
                    newItem[key] = value;
                }
        
                itemsPayload.items.push(newItem);
            });
        
            return itemsPayload;
        };
        
        const itemsPayloadData = iterateOverItems(dataPayload);
        console.log('Payload for Push:', itemsPayloadData);
        try {
            console.log('dedsd',pushDeTokenURL);
            const response = await axios.put(pushDeTokenURL,itemsPayloadData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            })
            console.log("DE Data Response: ", response)
          
     
        }
        catch(err) {
            console.error('Error while pushing: DE Data')
            if (err.response) {

                console.error('Response data:', err.response.data);
                console.error('Response status:', err.response.status);
                console.error('Response headers:', err.response.headers);
            } else if (err.request) {
                // The request was made but no response was received
                console.error('Request data:', err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', err.message);
            }
        }

    }
       
    async function fetchDEData(deReqToken,accessToken) {
        try {
            let fetchDEURL = `https://mc4by0xw84s11pznjgq1c45n7qr0.rest.marketingcloudapis.com/data/v1/customobjectdata/token/${deReqToken}/rowset?$page=1`;
            const response = await axios.get(fetchDEURL, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            })
          //  console.log("DE Data Response: ", response.data)
            if(response.data){
                await pushDERecord(accessToken,response.data)
            }
            // let deReqToken = response.data.requestToken
            // await fetchDEData(deReqToken)
        }
        catch(err) {
            console.error('Error while fetching: DE Data')
         
        }
    }
     
    
   




























    
    // const awsApiData = JSON.stringify(formData);
    // const awsApiOptions = {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: awsApiData
    // };

    

    // await fetch(accessUrl, accessUrlOptions)
    // .then(res => res.json())
    // .then(async data => {
    //     const AccessToken = data.AccessToken
    //     const accessUrlOptions = {
    //         method: "POST",
    //         headers: {
               
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             "grant_type": "client_credentials",
    //             "client_id": "7svddz3sf4jllv40lqnffolh",
    //             "client_secret": "ZfxbkAqcrbMnrXXBKyqIT08H",
    //             "account_id": "7236752"
    //         })
    //     }
        // await fetch(fetchUrl, fetchUrlOptions)
        // .then(data => data.json())
        // .then(async res => {
        //     const ApiData = JSON.stringify(formData);
        //     const fetchUrlOptions = {
        //         method: "GET",
        //         headers: {
        //             'Authorization': `Bearer ${AccessToken}`,
        //         },
        //         body: ApiData
                
               
        //     }
        //     await fetch(restUrl,{
        //         method: "POST",
        //         headers: {
        //             'Authorization': `Bearer ${AccessToken}`,
        //             'Content-Type':'application/json'
        //         },
                
        //         body: JSON.stringify(formData)
                
        //     })
        //     .then(res => res.json())
            

        // })





    // })
    

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
    
     //Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    //logData(req);
    res.send(200, 'Validate');
};
exports.stop = function (req, res) {

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

