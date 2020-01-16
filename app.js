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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const markdown = require('markdown-js');
  const str = fs.readFileSync('./README.md', 'utf8');
  const html = markdown.makeHtml(str);
  res.writeHeader(200, {'Content-Type': 'text/html'});
  res.write(html);
  res.end();
});

app.get('/testUtils.js', (req, res) => {
  res.sendFile('./public/testUtils.js', {root: __dirname});
});

app.get('/html2canvas.js', (req, res) => {
  res.sendFile('./node_modules/html2canvas/dist/html2canvas.min.js', {root: __dirname});
});

app.post('/testRailClient', (req, res) => {
  res.type('json');
  testRailClient.getTests(req.body.run_id).then(tests => {
    for (index in tests) {
      let testData = tests[index];
      if (testData.refs == req.body.test) {
        testRailClient.addResult(testData.id, {"status_id": 1, "comment": "login page loaded"}).then(resultData => {
          console.log('added result id ' + resultData.id + ' for test run: ' + testData.id);
          if (req.body.capture) {
            const dataUri = req.body.capture;
            imageDataUri.outputFile(dataUri, 'tmp.jpg').then(imgPath => {
              testRailClient.addAttachmentToResult(resultData.id, imgPath).then(attachmentData => {
                console.log('added attachment ' + imgPath + ' to result id ' + resultData.id);
                res.json(attachmentData);
              });
            });
          } else {
            res.json(resultData);
          }
        });
      }
    }
  });
});

app.listen(port, () => console.log(`listening on port ${port}!`));