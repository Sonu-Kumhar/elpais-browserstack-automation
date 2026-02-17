require("dotenv").config();

module.exports = {
  USERNAME: process.env.BROWSERSTACK_USERNAME,
  ACCESS_KEY: process.env.BROWSERSTACK_ACCESS_KEY,
  HUB_URL: "https://hub-cloud.browserstack.com/wd/hub"
};
