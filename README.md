# Helper app for Selenium IDE

## environment settings

configs in `.env` file

## variables

- TESTRAIL_HOST **(required, TestRail host)**
- TESTRAIL_USER **(required, TestRail user)**
- TESTRAIL_PASSWORD **(required, TestRail password or API key)**

## pre requirements

- Selenium IDE plugin installed in browser
- `node -v` >= 8.10 (you can use `nvm`)

## install
1. git clone
2. cp .env.dist .env
3. update environment configuration file: `.env`
4. `npm install`

## usage
1. `npm start`
2. open Selenium IDE plugin in browser and create new a test suite load it from a *.side file
3. add the `script execute` command in the early part of the your test with target:
    ```
    import('http://localhost:3030/testUtils.js').then((utils) => { window.sih = utils; });
    ```
4. functions from the `public/testUtils.js` can be used in `execute script` commands the in Selenium IDE test, for example:
- `sih.report(1, 'reference1', { status_id: 1, comment: 'page loaded' }, 'body');`
will add new report to TestRail to a test with 'refs' field set to 'reference1' that is set in test run id 1 and the report will contain data: { status_id: 1, comment: 'page loaded' }.
After creating the report the function will also add to it an attachment - jpg image created with html2canvas basing on the element with provided selector (in this case 'body').
The last parameter is optional - when not provided html2canvas "screenshot" is not attached to the report.

- `sih.clickAtPosition(element, clientX, clientY);`
(to shortify use alias: sih.cap)
simulates click on element (for example canvas) at specified x, y position

- `sih.fireMouseEvent(element, "mousedown", clientX, clientY);`
(to shortify use alias: sih.fme)
fires on element the mouse event of type "mousedown" at position x, y
