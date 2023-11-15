import puppeteer from "puppeteer";

const wsChromeEndpointurl =
  "ws://127.0.0.1:9222/devtools/browser/42a0c7a7-8fcd-42bc-ab2c-8ef206451650";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
let counter = 1;

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl,
  });

  // Create a new page
  const page = await browser.newPage();

  // Set a custom viewport size
  await page.setViewport({ width: 1680, height: 1024 });

  await page.goto(process.argv[2]);
  await sleep(3000);

  while (true) {
    const jobTiles = await page.$$(".jobs-search-results__list-item");

    // dont use async await to run them simultaenously
    for (let index = 0; index < jobTiles.length; index++) {
      const title = jobTiles[index];
      await page.bringToFront();

      //   if (!title) continue;

      try {
        await title.click(); // ERROR:

        await sleep(3000);

        const easyApplyBtn = await page.$$(".jobs-apply-button");

        if (!easyApplyBtn.length) continue;

        await easyApplyBtn[0].click();

        await sleep(1000); //good measure, recheck if removable

        const exitBackground = await page.$$(".artdeco-modal-overlay");

        let prev = "-";
        let percentage = "0";

        const secondButton =
          "/html/body/div[3]/div/div/div[2]/div/div[2]/form/footer/div[2]/button[2]";

        // we keep on clicking until there's the percentage count and it keeps on changing
        while (prev !== percentage) {
          const buttonWrapper = await page.$x(
            `/html/body/div[3]/div/div/div[2]/div/div[2]/form/footer/div[2]/button${
              percentage === "0" ? "" : "[2]"
            }`
          );

          console.log(buttonWrapper)

          const nextButton = buttonWrapper[buttonWrapper.length - 1];

          let elem = await page.$$(".pl3.t-14.t-black--light");
          elem = await elem[0].evaluate((x) => x.textContent);

          percentage = elem.trim();
          prev = percentage;

          await sleep(2000);

          await nextButton.click();

          console.log("has clicked");
          await sleep(2000);
        }

        console.log("got out");

        throw new Error("asdnoasd");
      } catch (error) {
        console.log(error);
      }
    }

    // go to next page
    const nextPageBtn = await page.$(
      `[data-testid="pagination-page-${++counter}"]`
    );
    await sleep(1000);

    await nextPageBtn.click();
    await sleep(3000);
  }
})();
