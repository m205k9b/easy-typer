const sitemapPlugin = require('sitemap-webpack-plugin').default
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const routes = [
  '/',
  '/practice',
  '/kata',
  '/reading',
  '/setting',
  '/summary',
  '/changelog',
  '/help',
  '/about',
  '/history',
  '/download'
]

const sitemapRoutes = routes.concat([
  '/buy-me-a-coffee',
  '/portal',
  '/portal/blog',
  '/portal/docs/get-started',
  '/portal/docs/changelog',
  '/portal/docs/download',
  '/portal/docs/intro'
])

const version = '(73)'
process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_WEB_VERSION = version

const name = '木易跟打器'

class StaticRouteFallbackPlugin {
  constructor (routes) {
    this.routes = routes
  }

  apply (compiler) {
    compiler.hooks.afterEmit.tap('StaticRouteFallbackPlugin', compilation => {
      if (process.env.NODE_ENV !== 'production') {
        return
      }

      const outputPath = compiler.options.output.path
      const indexPath = path.join(outputPath, 'index.html')

      if (!fs.existsSync(indexPath)) {
        compilation.warnings.push(new Error('index.html not found; static route fallbacks were not generated'))
        return
      }

      const indexHtml = fs.readFileSync(indexPath)
      this.routes
        .filter(route => route !== '/')
        .forEach(route => {
          const routePath = route.replace(/^\/+/, '').replace(/\/+$/, '')
          const targetDir = path.join(outputPath, routePath)
          const targetPath = path.join(targetDir, 'index.html')

          fs.mkdirSync(targetDir, { recursive: true })
          fs.writeFileSync(targetPath, indexHtml)
        })
    })
  }
}

module.exports = {
  pwa: {
    name,
    iconPaths: {
      faviconSVG: 'img/icons/favicon.svg',
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-180x180.png',
      maskIcon: null,
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    },
    appleMobileWebAppCapable: 'yes',
    assetsVersion: '35',
    display: 'standalone',
    themeColor: '#1c1f24',
    msTileColor: '#1c1f24'
    // // configure the workbox plugin
    // workboxPluginMode: 'InjectManifest',
    // workboxOptions: {
    //   // swSrc is required in InjectManifest mode.
    //   // swSrc: 'dev/sw.js'
    //   // ...other Workbox options...
    //   runtimeCaching: [
    //     {
    //       urlPattern: '/',
    //       handler: 'StaleWhileRevalidate',
    //       options: {
    //         cacheName: 'easy-typer-custom-cache',
    //         expiration: {
    //           maxAgeSeconds: 86400 * 30
    //         },
    //         cacheableResponse: {
    //           statuses: [0, 200]
    //         }
    //       }
    //     }
    //   ]
    // }
  },

  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',

  outputDir: 'docs',

  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = name
      return args
    })
    config.module.rule('md')
      .test(/\.md/)
      .type('asset/source')
    config.plugin('sitemap').use(sitemapPlugin, [
      {
        base: 'https://typer.owenyang.top',
        paths: sitemapRoutes,
        options: {
          filename: 'sitemap.xml',
          lastMod: true,
          changefreq: 'daily',
          priority: 0.7
        }
      }
    ])
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      }),
      new StaticRouteFallbackPlugin(routes)
    ],
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/')
      }
    }
  },
  productionSourceMap: false,
  devServer: {
    proxy: {
      '^/api': {
        target: 'https://typer.owenyang.top/',
        // target: 'http://localhost:3000/',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
