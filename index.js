const puppeteer = require('puppeteer');

const START_TIME = "1000";
const END_TIME = "1800";

if (process.argv.length != 5) {
  console.log("Usage: yarn start START_YEAR START_MONTH COOKIE");
  process.exit(0);
}

const [START_YEAR, START_MONTH, COOKIE] = process.argv.slice(2);
console.log(START_YEAR, START_MONTH, COOKIE);

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  page.setViewport({ width: 800, height: 600 });
  page.setCookie({
    value: COOKIE,
    name: "_factorial_session_v2",
    domain: ".api.factorialhr.com",
  });


  // ends on december or first date that is not submissable
  for (let i = START_MONTH; i < 13; i++) {
    await page.goto(`https://app.factorialhr.com/attendance/clock-in/${START_YEAR}/${i}`, {
      waitUntil: 'networkidle2',
    });
    console.log("loaded");
    await fillMonth(page);
  }
})();

const fillMonth = async (page) => {
  await page.waitForSelector("td>div>div>div>div>div>div:first-child>label>div>div>input");
  const starts = await page.$$("td>div>div>div>div>div>div:first-child>label>div>div>input");
  for (const input of starts) {
    const tr = (await input.evaluateHandle(node => {
      for (let i = 0; i < 11; i++) {
        node = node.parentNode;
      }
      return node;
    })).asElement();
    const className = await (await tr.getProperty("className")).jsonValue();
    if (className.includes("disabled_") || !!input.value) {
      console.log("skip disabled/filled", input.value);
      continue;
    }
    console.log("fill");
    // await input.click();
    await input.evaluate((element) => { element.click(); });

    await input.type(START_TIME);
    const input2 = await tr.$("td>div>div>div>div>div>div:last-child>label>div>div>input");
    // await input2.click();
    await input2.evaluate((element) => { element.click(); });

    await input2.type(END_TIME);

    await page.waitForTimeout(100);

    const button = await tr.$("button[type=button]");
    await button.evaluate((element) => { element.click(); });
    await page.waitForTimeout(500);
  }
  console.log("all filled");
};
