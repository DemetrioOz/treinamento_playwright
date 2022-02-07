const { chromium } = require("playwright");

let browser;
let context;
let page;

// executa antes de todos os teste
beforeAll(async () => {
  // navegador que é nosso driver
  browser = await chromium.launch({ headless: false }); // por default vem true
  // contexto é o nosso navegador em si
  context = await browser.newContext();
});
// executa antes de cada teste
beforeEach(async () => {
  // finalmente a nossa page onde
  page = await context.newPage();
});

// executa depois de cada teste
afterEach(async () => {
  // fecha a page
  await page.close();
});
// executa depois de todos os testes
afterAll(async () => {
  // fecha o contexto
  await context.close();
  // fecha o browser
  await browser.close();
});

describe("Primeiros Passos", () => {
  test("Abrindo o navegador", async () => {
    await page.goto("https://bemweb.bempromotora.com.br/");
  });
});
