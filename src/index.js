const { createLocalDriver } = require("./driver/driverFactory");
const { navigateToOpinion } = require("./scraper/navigation");
const { scrapeArticles } = require("./scraper/opinionScraper");
const { translateToEnglish } = require("./services/translation.service");


(async function main() {
  const driver = await createLocalDriver();

  try {
    console.log("Opening Opinion Section...");
    await navigateToOpinion(driver);

    console.log("Scraping articles...");
    const articles = await scrapeArticles(driver);

    console.log("\nFirst 5 Articles (Spanish):\n");

    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
    });

    // 🔥 Translate titles
    console.log("\nTranslated Titles (English):\n");

    for (let i = 0; i < articles.length; i++) {
      const translated = await translateToEnglish(articles[i].title);
      console.log(`${i + 1}. ${translated}`);
    }

  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await driver.quit();
  }
})();
