require("dotenv").config();

const { createLocalDriver, createRemoteDriver } = require("./src/driver/driverFactory");
const { runTestFlow } = require("./src/index");
const browsers = require("./src/config/browsers");

async function runLocal() {
  const driver = await createLocalDriver();
  await runTestFlow(driver);
  await driver.quit();
}

async function runBrowserStack() {
  await Promise.all(
    browsers.map(async (capabilities) => {
      const driver = await createRemoteDriver(capabilities);
      await runTestFlow(driver);
      await driver.quit();
    })
  );
}

(async function main() {

  const mode = process.env.RUN_MODE || "local";

  if (mode === "browserstack") {
    console.log("Running on BrowserStack (5 parallel sessions)...");
    await runBrowserStack();
  } else {
    console.log("Running locally...");
    await runLocal();
  }

  console.log("Execution completed.");
})();
