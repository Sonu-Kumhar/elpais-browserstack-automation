const { By, until } = require("selenium-webdriver");
const { ARTICLE_COUNT } = require("../config/constants");
const { downloadImage } = require("./imageDownloader");

async function scrapeArticles(driver) {
    const articles = [];

    // STEP 1: Collect article URLs first
    const linkElements = await driver.findElements(By.css("h2 a"));

    const articleUrls = [];

    for (let link of linkElements) {
        const href = await link.getAttribute("href");
        const title = await link.getText();

        if (title && title.trim().length > 20) {
            articleUrls.push(href);
        }

        if (articleUrls.length === ARTICLE_COUNT) break;
    }

    // STEP 2: Visit each article separately
    for (let i = 0; i < articleUrls.length; i++) {

        const url = articleUrls[i];

        await driver.get(url);
        await driver.wait(until.elementLocated(By.css("body")), 10000);

        // Extract title again (fresh DOM)
        let title = "";

        // 1️⃣ Try og:title meta tag
        try {
            const metaTitle = await driver.findElement(
                By.css('meta[property="og:title"]')
            );
            title = await metaTitle.getAttribute("content");
        } catch (err) { }

        // 2️⃣ Fallback to visible h1
        if (!title || title.trim().length < 10) {
            try {
                const h1Elements = await driver.findElements(By.css("h1"));
                for (let el of h1Elements) {
                    const text = await el.getText();
                    if (text && text.trim().length > 10) {
                        title = text;
                        break;
                    }
                }
            } catch (err) { }
        }

        // 3️⃣ Final fallback to document.title
        if (!title || title.trim().length < 10) {
            title = await driver.getTitle();
        }


        // Extract content
        let content = "";
        const paragraphs = await driver.findElements(By.css("article p"));

        for (let p of paragraphs) {
            const text = await p.getText();
            content += text + "\n";
        }

        // Extract image
        let imageUrl = null;
        try {
            const imgElement = await driver.findElement(By.css("figure img"));
            imageUrl = await imgElement.getAttribute("src");

            if (imageUrl) {
                await downloadImage(imageUrl, `article_${i + 1}.jpg`);
            }
        } catch (err) {
            console.log("No image found for article", i + 1);
        }

        articles.push({
            title,
            content,
            imageUrl
        });
    }

    return articles;
}

module.exports = { scrapeArticles };
