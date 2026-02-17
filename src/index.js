const { createLocalDriver } = require("./driver/driverFactory");
const { navigateToOpinion } = require("./scraper/navigation");
const { scrapeArticles } = require("./scraper/opinionScraper");

(async function main() {
  const driver = await createLocalDriver();

  try {
    console.log("Opening Opinion Section...");
    await navigateToOpinion(driver);

    console.log("Scraping articles...");
    const articles = await scrapeArticles(driver);

    console.log("\nFirst 5 Articles:\n");

    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
    });

  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await driver.quit();
  }
})();
