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
2. open Selenium IDE plugin in browser and load a test suite
3. add the helper `script execute` command in the early part of the your test with target:
    ```
    import('http://localhost:3030/testUtils.js').then((utils) => { window.sih = utils; });
    ```
4. exports from the `public/testUtils.js` can be used in next `execute script` commands in your test