const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const browserstackConfig = require("../config/browserstack.config");

const BUILD_NAME = `ElPais Automation - ${new Date().toISOString()}`;

async function createLocalDriver() {
  const options = new chrome.Options();

  options.addArguments(
    "--start-maximized",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage"
  );

  return await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}

async function createRemoteDriver(capabilities) {
  try {
    return await new Builder()
      .usingServer(
        `https://${browserstackConfig.USERNAME}:${browserstackConfig.ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`
      )
      .withCapabilities({
        browserName: capabilities.browserName,
        browserVersion: capabilities.browserVersion,
        platformName: capabilities.platformName,

        "bstack:options": {
          os: capabilities.os,
          osVersion: capabilities.osVersion,
          deviceName: capabilities.deviceName,
          realMobile: capabilities.realMobile || false,

          projectName: "ElPais Automation",
          buildName: BUILD_NAME,
          sessionName: `${capabilities.browserName || capabilities.deviceName} - Opinion Scraper`,

          local: false,
          debug: true,
          networkLogs: true
        }
      })
      .build();

  } catch (error) {
    console.error("Failed to create remote driver:", error.message);
    throw error;
  }
}

module.exports = {
  createLocalDriver,
  createRemoteDriver
};
