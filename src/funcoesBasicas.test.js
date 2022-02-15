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

  page = await context.newPage();
  await page.goto("https://letcode.in/test");
});
// executa antes de cada teste
beforeEach(async () => {
  // finalmente a nossa page onde
  // page = await context.newPage();
  // await page.goto("https://letcode.in/test");
});

// executa depois de cada teste
afterEach(async () => {
  // fecha a page
  // await page.close();
  // fecha o browser
  // await browser.close();
});
// executa depois de todos os testes
afterAll(async () => {
  // fecha o browser
  // await browser.close();
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

    // metodo double click
    // await page.dblClick();

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

  test("Waits", async () => {
    await page.click(selectors.btnClickTestFill);
    /**
     * locator retorna um locator do playwright com ele podemos rodar métodos diretamente com ele
     * exemplo:
     * const button = await page.locator('#button')
     * await button.click()
     * waitFor é uma espera dinâmica que espera um estado de opções
     * exemplo:
     * const button = await page.locator('#button').waitFor()
     */
    await page.locator("input#fullName").waitFor("visible");

    console.time();
    // espera dinâmica por um seletor
    await page.waitForSelector("input#fullName", 3000);

    // espera fixa
    await page.waitForTimeout(5000);
    console.timeEnd();
  });

  test("Selects", async () => {
    await page.click("a[href='/dropdowns']");

    // select comum
    // método $ ele encontra um elemento que corresponde ao seletor
    const select = await page.$("#fruits");
    const option = await page.$("option[value='2']");
    // setamos o select e usamos o metodo abaixo e passamos como parametro o option
    await select.selectOption(option);

    // multiple selects
    const selectMultiple = await page.$("#superheros");
    await selectMultiple.selectOption([
      { label: "Ant-Man" },
      { value: "bt" },
      { index: 8 },
    ]);
  });

  test("locators", async () => {
    console.time();
    const edit = await page.locator("a[href='/edit']");
    console.log(`edit value == ${await edit.textContent()}`);

    const buttons = await page.$("a[href='/buttons']");
    console.log(`button value == ${await buttons.textContent()}`);

    // captura multiplos elementos
    const cards = await page.$$("div[class='']");
    console.log(`cards com $$ == ${cards.length}`);
    console.timeEnd();
  });

  test("checks", async () => {
    await page.click("a[href='/radio']");

    // insere um check no radio
    await page.check("input#yes");

    await page.waitForTimeout(2000);

    // retira um check no radio
    await page.uncheck("xpath=(//div[@class='field'])[6]/label[2]/input");
  });

  test("Nova pagina", async () => {
    await page.click("a[href='/windows']");

    const [novaPagina] = await Promise.all([
      context.waitForEvent("page"),
      await page.click("#home"),
    ]);

    console.log(await novaPagina.url());

    await novaPagina.close();
  });

  test("multiplas paginas", async () => {
    await page.click("a[href='/windows']");

    const [multipage] = await Promise.all([
      context.waitForEvent("page"),
      await page.click("#multi"),
    ]);

    await multipage.waitForLoadState();

    // $ == page
    // pageOne = vai representar pagina aberta
    // pageTwo = a segunda pagina
    const [$, pageOne, pageTwo] = await multipage.context().pages();

    console.log(await pageOne.url(), await pageTwo.url());

    await pageOne.close();
    await pageTwo.close();
  });

  test("frames", async () => {
    await page.click("a[href='/frame']");

    await page.waitForLoadState();

    const frame = page.frame({ name: "firstFr" });

    await frame.fill("input[name='fname']", "Demetrio");
    await frame.fill("input[name='lname']", "dev");

    /**
     * em casos onde o iframe possui um iframe dentro
     * usamos o método abaixo para manuseá-los a variavel 'frames' retornara um array
     */
    const frames = await frame.childFrames();

    await frames[0].fill("input[name='email']", "meuEmail@gmail.com");

    await page.waitForTimeout(4000);
  });

  test("drag and drop", async () => {
    await page.click("a[href='/dropable']");

    const drag = await page.$("#draggable");
    const drop = await page.$("#droppable");

    // metodo boundingBox retorna uma caixa com os tamanhos das coordenadas x,y e height, width
    const dragBound = await drag.boundingBox();
    const dropBound = await drop.boundingBox();

    // aqui começa o drag em drop, se utiiza os metodos do mouse para tais ações
    await page.mouse.move(dragBound.x, dragBound.y);
    await page.mouse.down();
    await page.mouse.move(dropBound.x, dropBound.y);
    await page.mouse.down();

    await page.waitForTimeout(4000);
  });
});
