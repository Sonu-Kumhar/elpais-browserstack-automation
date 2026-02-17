const { createLocalDriver } = require("./driver/driverFactory");
const { navigateToOpinion } = require("./scraper/navigation");
const { scrapeArticles } = require("./scraper/opinionScraper");
const { translateToEnglish } = require("./services/translation.service");
const { analyzeWordFrequency } = require("./services/textAnalysis.service");


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


    // Collect translated titles
    const translatedTitles = [];

    for (let i = 0; i < articles.length; i++) {
      const translated = await translateToEnglish(articles[i].title);
      translatedTitles.push(translated);
      console.log(`${i + 1}. ${translated}`);
    }

    // 🔥 Analyze repeated words
    const repeated = analyzeWordFrequency(translatedTitles);

    console.log("\nRepeated Words (>2 times):\n");

    if (Object.keys(repeated).length === 0) {
      console.log("No words repeated more than twice.");
    } else {
      for (let word in repeated) {
        console.log(`${word} → ${repeated[word]} times`);
      }
    }


  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await driver.quit();
  }
})();
