const express = require('express');
const router = express.Router();
const superagent = require('superagent');

const baseUrl = 'http://localhost:8080/webservice/rest/comp';
const mediaType = {json: 'application/json'};

router.post('/add', (req, res) => {
    const webservice = req.body;
    superagent.post(`${ baseUrl }/add`)
        .type(mediaType.json)
        .send(webservice)
        .end((error, response) => {
            if (error) {
                res.send({success: false, id: null, error: error});
            } else if (response) {
                res.send({success: true, id: webservice.id});
            }
        });
});

router.post('/run', (req, res) => {
    const webservice = req.body;
    superagent.post(`${ baseUrl }/run`)
        .type(mediaType.json)
        .send(webservice)
        .end((error, response) => {
            if (error) {
                res.send({error: error});
            } else if (response) {
                res.send(response.body);
            }
        });
});

router.get('/result', (req, res) => {
    const {guid} = req.query;
    superagent.get(`${ baseUrl }/runresult`)
        .query({run: guid})
        .end((error, response) => {
            if (error) {
                res.send({success: false, guid: guid, error: error})
            }else if (response) {
                res.send(response.body);
            }
        });
});

module.exports = router;
