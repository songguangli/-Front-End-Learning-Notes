webpack is a moudule bundler
webpack 就是一个模块打包工具

ES Moudule 模块引入方式
import Header from './header.js';
webpack 能够识别 引入模块的语法
此句中 Header 是一个模块

webpack 可以在全局中安装也可以在单独的项目中安装
全局安装的缺点是，如果有多个项目，每个项目的使用的 webpack 版本不同，那么和全局 webpack 环境不同的项目就无法运行。
项目内安装 webpack 的优点是，可以通过命令指定安装的 webpack 版本。
项目内使用 webpack 命令：
npx webpack -v

默认配置文件：webpack.config.js
设置了配置文件，可以直接运行，npx webpack 打包

npx webpack --config newwebpackconfig.js
此命令是让 webpack 以名为 newwebpackconfig.js 文件作为配置文件进行打包

webpack-cli 使得能够在命令行中使用 webpack 命令


如果想在项目中引用 jpg 等静态文件，webpack 需要在配置文件中引用 module 来做配置：
module: {
    rules: [{
        test:/\.(jpg|png|gif)$/,
        use: {
            loader: 'url-loader',
            options: {
                // placeholder 占位符
                name: '[name].[ext]',
                outputPath: 'images/'，
                limit: 204800
            }
        }
    }]
}

url-loader 和 file-loader 的区别
url-loader 会将图片以 base64 的形式打包到 bundle.js 中，优点是图片会随着 js 文件一起加载完成，所以适用于一些小图片的打包，不会影响速度的同时，可以更快地展示出来。主要就是可以通过指定 limit 属性来选择性的把图片打包到文件夹或 bundle.js 中。
file-loader 可以把图片打包到一个自定义的文件夹下，适合大体积图片的打包，不影响 bundle.js 的执行速度。


打包 css 文件：
使用 style-loader 和 css-loader 

improt style from './index.scss'
模块化引入 css 文件，不影响其他文件中的样式
使用：
var img = new Image();
img.src = avatar;
img.classList.add(style.avatar(样式))

{test: /\.css$/,
use: ['style-loader',
 {
    loader: 'css-loader',
    options: {
        importLoaders: 2  ,
        // 每次先执行前面两个loader
        modules: true
        //
    }
 },
 'sass-loader',
 'postcss-loader',

 ]}

loader 是从下到上，从右到左的执行顺序


使用 postcss-loader ：
需要先创建一个 postcss.config.js 配置文件
然后在 plugins : [
    require('autoprefixer')
]
就可以自动添加 -webkit-


打包字体文件：
module: {
    rules: [{
        test: /\.(eot|ttf|svg)$/,
        loader: 'file-loader'
    }]
}


<!-- 使用 plugins 让打包更便捷 -->
plugins 可以在 webpack 运行到某个时刻的时候，帮你做一些事情，比较像 vue 中的生命周期函数


htmlWebpackPlugin 会在打包结束后，自动在 dist 目录下生成一个 html 文件，并把打包生成的 js自动引入到 html 文件中

webpack.config.js 配置文件下：
// 先引用 html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
plugins: [new HtmlWebpackPlugin({
    template: 'src/index.html'
})]
}


<!-- clean-webpack-plugin -->
const CleanWebpackPlugin = require('clean-webpack-plugin')

plugins:[
    new CleanWebpackPlugin(['dist'])
]


<!-- entry 和 output 的基础配置 -->
entry: {
    main: './src/index.js',
    sub: './src/index.js'
}

output: {
    publicPath: 'http://cdn.com.cn'
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
}


<!-- SourceMap 的配置 -->
sourceMap 是一个映射关系，它知道 dist 目录下的 main.js 某行错误代码，实际上对应的是 src 目录下 index.js 源代码中的某行代码

devtool: 'source-map'

inline-source-map 
inline 会直接把映射文件打包到main.js

inline-cheap-source-map 
cheap 提升打包性能，错误精确到行，不打印列

cheap-module-source-map 
module 同时考虑 loader 等

eval 执行效率最快

平常使用推荐：
mode: 'development',
devtool: 'cheap-module-eval-source-map'

mode: 'production',
devtool: 'cheap-module-source-map'



<!-- 使用 WebpackDevSever 提升开发效率 -->
<!-- 第一种做法 -->
源代码发生变化，webpack 监听变化，重新打包
scripts: {
    "watch": "webpack --watch"
}

npm run watch

<!-- 第二种做法 -->
先安装 webpack-dev-server
然后在 webpack.config.js 做配置：
devServer: {
    contentBase: './dist',
    open: true，  // 自动打开浏览器，和端口
    port: 8080
}

优点：自动搭建一个服务器，可以发 ajax 请求，
也是最常用的自动打包工具

<!-- 第三种做法 -->
可以通过 express 和 webpackDevMiddleware 自己写一个 node.js 文件起服务



<!-- Hot Module Replacement -->
<!-- H M R -->
<!-- 热模块更新 -->
const webpack = require('webpack')

devSever: {
    hot: true,
    hotOnly: true
}

plugins: [
    new webpack.HotModulePlacementPlugin()
]

可以在不改变页面的情况下，更新 css
css 不需要写 module.hot 是因为 css-loader 已经帮你实现了

HMR 也可以改变作用在 js 上
需要配置：
if(module.hot) {
    module.hot.accept('./number', () => {
        const a = document.getElementById('number')
        document.body.removeChild(a)
        number();
    })
}



<!-- 使用 Babel 处理 ES6 语法 -->
npm install babel-loader @babel/core -D
npm install @babel/preset-env -D
npm install @babel/polyfill -D

业务代码配置：
module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            presets: [["@babel/preset-env", {
                targets: {
                    chrome: "67",
                },
                useBuiltIns: 'usage'
            }]]
        }
    }]
}

js 文件中： import "@babel/polyfill"


库项目代码：
module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            "plugins": [["@babel/plugin-transform-runtime", {
                "corejs": 2,
                "helpers": true,
                "regenerator": true,
                "useESModules": false
            }]]
        }
    }]
}

 避免污染全局环境


<!-- Tree Shaking -->
当引入一个模块的时候，不引入全部的方法，只引入需要的方法，就需要使用 Tree Shaking

Tree Shaking 只支持 ES Module
支持：  import { add } from './math.js'
不支持：const add = require('./')

在 webpack.config.js 中配置

<!-- // 开发环境中 development -->
plugins 下面添加一个：
optimization: {
    usedExports: true
}

在 package.json 中：
"sideEffects": false,

如果需要引入 @babel/polly-fill
"sideEffects": ["@babel/polly-fill"]

css 文件也不要使用 Tree Shaking
"sideEffects": [
    "*.css"
]

<!-- production 模式中 -->
不需要配置，会自动配置：
optimization: {
    usedExports: true
}

需要配置 package.json 中：
"sideEffects": false,
或者把需要过滤的放入数组中



<!-- Development 和 Production 模式的区分打包 -->
可以配置两个 webpack.config.js
例如 :
webpack.dev.js
webpack.prod.js

在 package.json 中：
"scripts": {
    "dev": "webpack-dev-server --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
}

再创建一个 webpack.common.js
把 webpack.dev.js 和 webpack.prod.js 中重复的代码放入 webpack.common.js 中

安装：
npm install webpack-merge -D 

webpack.dev.js 中做引入：
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

module.exports = merge(commonConfig, devConfig)


<!-- Webpack 和 Code Splitting (代码分割) -->
可以把需要引入的库文件，独立创建一个文件，然后再webpack.config.js 中配置入口文件时，设置多个文件为入口文件，这样生成的 dist 目录下的文件也会被拆分成多个文件。
当业务代码逻辑发生改变时，用户不需要重新加载库文件，只需要重新加载被修改的业务代码文件，速度更快，提升用户体验

例如: 
entry: {
    lodash: './src/lodash.js',
    main: './src/main.js'
}


自动 Code Splitting: 使用 splitChunks

同步时： 
import _ from 'lodash'
~~ 业务逻辑 ~~

在 webpack.config.js 中：
optimization: {
    splitChunks: {
        chunks: 'all'
    }
}

异步时：
function getComponent() {
    return import(/* webpackChunkName:"lodash" */'lodash').then(({ default: _ }) => {

    })
}
不需要设置 optimization

总结：
代码分割，和 webpack 无关
webpack 中实现代码分割，两种方式
1.同步代码： 只需要在 webpack.common.js 中做 optimization 的配置即可
2.异步代码 ( import )：无需做任何配置，会自动进行代码分割，放置到新的文件中


<!-- splitChunksPlugins 配置参数 -->
默认配置：
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', 
      // 只对异步代码生效
      // chunks: 'all'
      // chunks: 'initial' 同步
      
      minSize: 20000,
      minRemainingSize: 0,
      maxSize: 0,
      // 不常用，可以进行多次代码分割

      minChunks: 1,
      // 拆分前必须共享模块的最小 chunks 数。

      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,  // 优先级
          reuseExistingChunk: true,
        //filename: 'vendors.js'

        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};


<!-- Lazy Loading 懒加载 -->
<!-- Chunk 是什么 -->
使用 import 实现懒加载
需要配合使用 @bebal/polly-fill


<!-- 打包分析 -->

github.com/webpack/analyse
webpack 官网 -> Code Splitting -> Bundle Analysis -> 选择分析工具

<!-- Preloading -->
<!-- Prefetching -->
import(/* webpackPrefetch: true */ './click.js').then()

利用 Prefecth 可以实现当页面主要内容加载完成后，自动继续加载其它模块的文件，例如登录模块。
这样既保证了主页加载速度变快，同时用户在点击其他模块时，此模块的文件已经被缓存，提升用户体验
前端性能优化，应该把重点放在 code coverage


<!-- css 文件的代码分割 -->
MiniCssExtractPlugin


<!-- webpack 与浏览器缓存 Caching -->
为了处理用户浏览器缓存与新上传的文件名字相同导致用户的浏览器不更新的情况
上线打包的配置：
output: {
    filename: '[name].[contenthash].js',
    chunkFilname: '[name].[contenthash].js'
}

旧版本 webpack ：
需要在配置中添加：
optimization: {
    runtimeChunk: {
        name: 'runtime'
    }
}


<!-- Shimming -->
const webpack = require('webpack')

plugins: [
    new webpack.ProvidePlugin({
        $: 'jquery',
        _: 'lodash',
        _join: ['lodash', 'join']
    })
]


<!-- imports-loader -->
loader: 'import-loader?this=>window'


<!-- 环境变量的使用 -->
webpack.common.js 中：
module.exports = (env) => {
    if(env && env.production) {
        return merge(commonConfig, prodConfig)
    } else {
        return merge(commonConfig, devConfig)
    }
}

package.json 中： 
"scripts":  {
    "dev-build": "webpack --config ./build/webpack.common.js",
    "dev": "webpack-dev-server --config ./build/webpack.common.js",
    "build": "webpack --env.production --congig ./build/webpack.common.js"
}