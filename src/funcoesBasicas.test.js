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
  await page.goto("https://letcode.in/test");
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

// guardara nossos seletores
let selectors = {
  btnClickTestButton: "a[href='/buttons']",
  btnClickHome: "button[id='home']",
  btnClickTestFill: "a[href='/edit']",
  inputFullName: "input[id='fullName']",
  btnClickTestAlert: "a[href='/alert']",
};

describe("Funções básicas do playwright", () => {
  test("Click", async () => {
    //seleciona nosso teste do card
    await page.click(selectors.btnClickTestButton);
    // clica para voltar para a home
    await page.click(selectors.btnClickHome);

    const expectedUrl = "https://letcode.in/";
    // puxa a url da pagina
    const url = await page.url();

    // valida se a pagina foi para url certa
    expect(url).toEqual(expectedUrl);
  });

  test("Fill", async () => {
    let nome = "Minuano Fronteiriço";

    await page.click(selectors.btnClickTestFill);
    //preenche o input
    await page.fill(selectors.inputFullName, nome);

    //pega o value do input
    let content = await page.inputValue(selectors.inputFullName);

    expect(content).toEqual(nome);
    // para limpar inputs
    // await page.evaluate(() => (document.getElementById("inputID").value = ""));
  });

  test("Alerts and dialogs", async () => {
    await page.click(selectors.btnClickTestAlert);

    // usado para capturar um elemento
    const element = await page.$("#prompt");

    page.on("dialog", (dialog) => {
      // metodos que se comunicam com dialogo
      console.log(dialog.message());
      dialog.accept("Ola matheus");
    });

    await element.click();
  });
});
