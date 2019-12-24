'use strict'
const path = require('path')
module.exports = {
    dev: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/api': {
                target: 'http://192.168.13.184:8080/api/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                },
                secure: false
            },
            '/listener': {
                target: 'http://192.168.13.184:8080/listener/',
                changeOrigin: true,
                pathRewrite: {
                    '^/listener': ''
                },
                secure: false
            }
        },
        host: 'localhost',
        port: 8088,
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false,
        devtool: 'cheap-module-eval-source-map',
        cacheBusting: true,
        cssSourceMap: true
    },
    build: {
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        devtool: '#source-map',
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    }
}