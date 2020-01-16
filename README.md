# Helper app for Selenium IDE

## environment settings

configs in `.env` file

### VARIABLES

- TESTRAIL_HOST **(required, TestRail host)**
- TESTRAIL_USER **(required, TestRail user)**
- TESTRAIL_PASSWORD **(required, TestRail password or API key)**

### pre requirements

- Selenium IDE plugin installed in browser
- `node -v` >= 8.10 (you can use `nvm`)

## install
1. git clone
2. update environment configuration file: `.env`
3. `npm install`

### usage
1. `npm start`
2. open Selenium IDE plugin in browser and load test suite test.side
