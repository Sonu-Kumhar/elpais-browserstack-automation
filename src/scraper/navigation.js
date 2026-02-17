const { By, until } = require("selenium-webdriver");
const { OPINION_URL } = require("../config/constants");

async function navigateToOpinion(driver) {
  await driver.get(OPINION_URL);

  // Wait for page body
  await driver.wait(until.elementLocated(By.css("body")), 10000);

  // Small scroll to trigger lazy load
  await driver.executeScript("window.scrollBy(0, 500);");

  // Wait for article titles
  await driver.wait(
    until.elementsLocated(By.css("h2 a")),
    10000
  );
}

module.exports = { navigateToOpinion };
