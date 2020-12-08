const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',

        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            '@btn-primary-bg': '#212121',
             '@checkbox-color': '#212121',

            '@input-border-color': '#EEEEEE',
            '@input-hover-border-color': '#616161',
            '@link-hover-color': '#424242',
            '@menu-item-color':'#212121',
            '@menu-highlight-color': '#212121',
        },
    }),
);