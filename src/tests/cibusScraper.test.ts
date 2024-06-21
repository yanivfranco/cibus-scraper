import { CibusScrapper } from "../cibusScrapper";
import { options } from "./testConfig";

jest.setTimeout(60000);

describe("CibusScrapper", () => {
  let scrapper: CibusScrapper;

  beforeEach(() => {
    scrapper = new CibusScrapper();
  });

  it("scrap method navigates to login and fills form", async () => {
    const { balance } = await scrapper.scrap(options);
    expect(balance).toBeDefined();
    expect(balance).toBeGreaterThan(-1);
  });
});
