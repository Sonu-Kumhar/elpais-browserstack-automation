const { createRemoteDriver } = require("../driver/driverFactory");
const browsers = require("../config/browsers");
const { navigateToOpinion } = require("../scraper/navigation");
const { scrapeArticles } = require("../scraper/opinionScraper");

async function runTest(capabilities) {
  const driver = await createRemoteDriver(capabilities);

  try {
    await navigateToOpinion(driver);
    await scrapeArticles(driver);
  } catch (error) {
    console.error("Error in session:", error.message);
  } finally {
    await driver.quit();
  }
}

async function runParallelTests() {
  await Promise.all(browsers.map(runTest));
}

module.exports = { runParallelTests };
