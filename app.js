require('dotenv').config();
const port = 3030;
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const testRailConfig = {
  host: process.env.TESTRAIL_HOST,
  user: process.env.TESTRAIL_USER,
  password: process.env.TESTRAIL_PASSWORD
};
const TestRail = require('testrail');
const testRailClient = new TestRail(testRailConfig);
const fs = require('fs');
const imageDataUri = require('image-data-uri');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', (req, res) => {
  const markdown = require('markdown-js');
  const str = fs.readFileSync('./README.md', 'utf8');
  const html = markdown.makeHtml(str);
  res.writeHeader(200, {'Content-Type': 'text/html'});
  res.write(html);
  res.end();
});

app.get('/testUtils.js', (req, res) => {
  //res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=None");
  res.sendFile('./public/testUtils.js', {root: __dirname});
});

app.get('/html2canvas.js', (req, res) => {
  //res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=None");
  res.sendFile('./node_modules/html2canvas/dist/html2canvas.min.js', {root: __dirname});
});

app.post('/testRailClient', (req, res) => {
  res.type('json');
  testRailClient.getTests(req.body.runId).then(tests => {
    var foundTests = 0;
    var responseSet = false;
    for (index in tests) {
      var testData = tests[index];
      if (testData.refs == req.body.testRefs) {
        foundTests++;
        testRailClient.addResult(testData.id, req.body.reportData).then(resultData => {
          console.log('added result id ' + resultData.id + ' for test run: ' + testData.id);
          if (req.body.dataUri) {
            const timestamp = new Date() / 1000 | 0;
            imageDataUri.outputFile(req.body.dataUri, req.body.runId + '_' + req.body.testRefs + '_' + resultData.id + '_' + timestamp + '.jpg').then(imgPath => {
              testRailClient.addAttachmentToResult(resultData.id, imgPath).then(attachmentData => {
                console.log('added attachment ' + imgPath + ' to result id ' + resultData.id);
                fs.unlink(imgPath , err => { if(err) console.log(err); });
              });
            });
          }
          responseSet || res.json({ success: true });
          responseSet = true;
        }).catch(error => {
          console.log(error);
          responseSet || res.json({ error: error });
          responseSet = true;
        });
      }
    }
    if(foundTests === 0) {
      res.json({ error: 'Cannot find the test with reference ' + req.body.testRefs + ' in the test run ' + req.body.runId + '. Please verify tests settings in Test Rail.' });
    }
  }).catch(error => {
    res.json({ error: 'Cannot access TestRail API. Please verify if ".env" file is set correctly and the test run "' + req.body.runId + '" exists. ' + error });
  });
});

app.listen(port, () => console.log(`listening on port ${port}!`));