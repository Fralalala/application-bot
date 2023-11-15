import puppeteer from "puppeteer";

const wsChromeEndpointurl =
  "ws://127.0.0.1:9222/devtools/browser/1551e574-1c45-4dbd-b30d-9a045b1c43ef";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms)); //*[@id="mosaic-provider-jobcards"]/ul
}
let counter = 3;

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl,
  });

  // Create a new page
  const page = await browser.newPage();

  // Set a custom viewport size
  await page.setViewport({ width: 1280, height: 1024 });

  await page.goto(process.argv[2]);
  await sleep(3000);

  // this should be minus 1. There's a ghost li at the end

  while (true) {
    const jobTiles = await page.$$(".css-5lfssm.eu4oa1w0");

    // dont use async await to run them simultaenously
    for (let index = 0; index < jobTiles.length; index++) {
      const title = jobTiles[index];
      await page.bringToFront();

      if (!title) continue;

      try {
        await title.click(); // ERROR:

        const content = await title.evaluate((x) => x.textContent);
        const isEasilyApply = content.includes("Easily apply");

        await sleep(1000);

        if (isEasilyApply) {
          const smartApplyBtn = await page.$$("#indeedApplyButton");

          // Adds a new page at the end
          await smartApplyBtn[0].click();

          // Apparently opening a page isnt caught yet even after the await (the above await). wtf
          await sleep(3000);

          let list = await browser.pages();
          let recentPage = list[list.length - 1];

          await recentPage.setViewport({ width: 1920, height: 1080 }); // Adjust width and height as needed

          await sleep(1000);

          console.log("before clicking");

          // click resume
          const resume = await recentPage.$x(
            "/html/body/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div/main/div[1]/div/div/div[1]/div[5]"
          );

          await resume[0].click();

          const seeMore = await recentPage.$x("/html/body/div[2]/div/div[2]/aside/div[3]/button")

          await seeMore[0].click()

          await sleep(1000);
          console.log("after clicking");

          let prevUrl = "";
          let currentUrl = recentPage.url();

          while (
            currentUrl !==
            "https://smartapply.indeed.com/beta/indeedapply/form/post-apply" 
          ) {
            if (prevUrl === currentUrl) {
              console.log(prevUrl, currentUrl);
              throw new Error("Manual Input required");
            }

            const continueBtn = await recentPage.$$(".ia-continueButton");

            continueBtn

            await continueBtn[0].click();
            await sleep(3000);

            prevUrl = currentUrl;
            currentUrl = recentPage.url();
          }

          await recentPage.close();
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    const nextPageBtn = await page.$(
      `[data-testid="pagination-page-${++counter}"]`
    );
    await sleep(1000);

    await nextPageBtn.click();
    await sleep(3000);
  }
})();
