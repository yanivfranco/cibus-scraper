import { CibusScraper } from "../cibusScraper";
import { options } from "./testConfig";

jest.setTimeout(60000);

describe("CibusScrapper", () => {
  let scrapper: CibusScraper;

  beforeEach(() => {
    scrapper = new CibusScraper();
  });

  it("scrap method navigates to login and fills form", async () => {
    const { balance } = await scrapper.scrap(options);
    expect(balance).toBeDefined();
    expect(balance).toBeGreaterThan(-1);
  });
});
