const { chromium } = require("playwright");

import Login from "../PageObjects/pages/login/Login.actions";

let browser;
let context;
let page;

beforeEach(async () => {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
});

afterEach(async () => {
  await browser.close();
});

describe("Digitacao proposta", () => {
  test("Abrindo o navegador", async () => {
    const login = new Login(page);
    await page.goto("https://bemweb.bempromotora.com.br/");
  });
});
