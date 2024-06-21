import { readFileSync } from "fs";
import { CibusScraper, CibusScraperOptions } from "../src/cibusScraper";

jest.setTimeout(60000);

describe("CibusScrapper", () => {
  let scrapper: CibusScraper;
  const options = JSON.parse(readFileSync("tests/testConfig.json", "utf8")) as CibusScraperOptions;
  beforeEach(() => {
    scrapper = new CibusScraper();
  });

  it("scrap method navigates to login and fills form", async () => {
    const { balance } = await scrapper.scrap(options);
    expect(balance).toBeDefined();
    expect(balance).toBeGreaterThan(-1);
  });
});
