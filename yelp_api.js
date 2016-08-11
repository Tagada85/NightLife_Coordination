const request = require('request');
const oauthSignature = require('oauth-signature');
const n = require('nonce')();
const qs = require('querystring');
const _ = require('lodash');

module.exports.request_api = function(set_parameters, callback) {

  /* The type of request */
  var httpMethod = 'GET';

  /* The url we are using for the request */
  var url = 'http://api.yelp.com/v2/search';

  /* We set the require parameters here */
  var required_parameters = {
    oauth_consumer_key : 'ILOGXpRCLxkKSJW29geomQ',
    oauth_token : 'TZMrsnFkOlzbH4ll4-7mcT_2yyepYt42',
    oauth_nonce : n(),
    oauth_timestamp : n().toString().substr(0,10),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0'
  };

  var default_parameters = {
    location: 'Paris'
  }

  /* We combine all the parameters in order of importance */ 
  var parameters = _.assign(default_parameters, set_parameters, required_parameters);

  /* We set our secrets here */
  var consumerSecret = 'DLkTNlvkRXvZyXTs2-iRHvGwqJA';
  var tokenSecret = 'IqdrNOtSzKZXV-YjHGbc7C6ik44';

  /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
  /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

  /* We add the signature to the list of paramters */
  parameters.oauth_signature = signature;

  /* Then we turn the paramters object, to a query string */
  var paramURL = qs.stringify(parameters);

  /* Add the query string to the url */
  var apiURL = url+'?'+paramURL;

  /* Then we use request to send make the API Request */
  request(apiURL, function(error, response, body){
    return callback(error, response, body);
  });

};