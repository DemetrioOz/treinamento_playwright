module.exports = {
  // define de quantos em quantos erros serão expostos no console
  bail: 0,
  // faz com que o que jest encontra os arquivos de testes de globalmente
  testMatch: ["**/*.test.js"],
  // arquivos para o jest ignorar
  transformIgnorePatterns: ["\\\\node_modules\\\\"],
  // define um valor para rodar os testes
  testTimeout: 200000,
};
