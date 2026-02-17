const { By } = require("selenium-webdriver");
const { ARTICLE_COUNT } = require("../config/constants");

async function scrapeArticles(driver) {
  const articles = [];

  // Get all h2 titles (more generic)
  const titleElements = await driver.findElements(By.css("h2"));

  for (let i = 0; i < titleElements.length; i++) {
    const title = await titleElements[i].getText();

    if (title && title.trim().length > 20) {
      articles.push({ title });
    }

    if (articles.length === ARTICLE_COUNT) break;
  }

  return articles;
}

module.exports = { scrapeArticles };
