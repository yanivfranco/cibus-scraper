import puppeteer, { PuppeteerLaunchOptions } from "puppeteer";
import { logger } from "./logger";

export interface CibusScraperOptions {
  username: string;
  password: string;
  company: string;
  puppeteerLaunchOptions?: PuppeteerLaunchOptions;
}

export interface CibusScraperResult {
  balance: number;
}

export class CibusScraper {
  constructor() {}
  async scrap({ puppeteerLaunchOptions, username, password, company }: CibusScraperOptions) {
    return new Promise<CibusScraperResult>(async (resolve, reject) => {
      logger.info("Start scrapping Cibus...");
      const browser = await puppeteer.launch(puppeteerLaunchOptions);
      const page = await browser.newPage();
      await page.goto("https://consumers.pluxee.co.il/login");
      await page.waitForSelector("#user");
      await page.type("#user", username);

      await page.waitForSelector(".login-btn");
      await page.click(".login-btn");

      await page.waitForSelector("#password");
      await page.type("#password", password);

      await page.waitForSelector("#company-inp");
      await page.type("#company-inp", company);
      const isResolved = { value: false };

      page.on("response", async (response) => {
        if (
          response.url().includes("https://api.consumers.pluxee.co.il/api/prx_user_info.py") &&
          response.request().method() === "GET" &&
          response.status() === 200 &&
          !isResolved.value
        ) {
          const data = await response.json();
          logger.info({ cibusData: data }, "Got data from Cibus");
          browser.close();
          isResolved.value = true;
          resolve({ balance: Number.parseFloat(data.budget) });
        }
      });

      // Timeout for the case that the response event is not triggered
      setTimeout(() => {
        if (isResolved.value) {
          return;
        }

        logger.error("Timeout reached, no response from Cibus");
        browser.close();
        reject(new Error("Timeout reached, no response from Cibus"));
      }, 15000);

      // Login
      await page.waitForSelector(".login-btn");
      await page.click(".login-btn");
    });
  }
}
