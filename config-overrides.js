const path = require('path')

const {
  override,
  addBabelPlugin,
  fixBabelImports,
  addWebpackAlias,
  addPostcssPlugins,
} = require('customize-cra')

module.exports = override(
  addBabelPlugin('idx'),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addPostcssPlugins([require('tailwindcss')]),

  addWebpackAlias({
    '@src': path.resolve(__dirname, './src'),
    '@components': path.resolve(__dirname, './src/components'),
    styles: path.resolve(__dirname, './src/styles'),
    utils: path.resolve(__dirname, './src/utils'),
    charts: path.resolve(__dirname, './src/actions/charts'),
    common: path.resolve(__dirname, './src/components/common'),
  })
)
