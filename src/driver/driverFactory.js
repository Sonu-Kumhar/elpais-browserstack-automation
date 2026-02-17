const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const browserstackConfig = require("../config/browserstack.config");

async function createLocalDriver() {
  const options = new chrome.Options();
  options.addArguments("--start-maximized");

  return await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}

async function createRemoteDriver(capabilities) {
  return await new Builder()
    .usingServer(
      `https://${browserstackConfig.USERNAME}:${browserstackConfig.ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`
    )
    .withCapabilities({
      ...capabilities,
      "bstack:options": {
        projectName: "ElPais Automation",
        buildName: "Cross Browser Test",
        sessionName: capabilities.browserName || capabilities.deviceName
      }
    })
    .build();
}

module.exports = {
  createLocalDriver,
  createRemoteDriver
};
