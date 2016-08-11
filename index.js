const express = require('express');
const bodyParser = require('body-parser');

const request_api = require('./yelp_api').request_api;

const app = express();

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res)=>{
	request_api({}, (err, data)=>{
		if(err) throw err;
		let jsonBody = JSON.parse(data.body);
		console.log(jsonBody.businesses);
	});
	
	res.end('Done');
});

app.listen(3000, ()=>{
	console.log('Listening at', port);
});