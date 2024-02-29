/** @type {import("prettier").Config} */
module.exports = {
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  singleQuote: true,
  importOrder: ['^~/(.*)$', '^../(.*)$', '^./'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
