module.exports = {
  appName: 'Wind.GEL.Enterprise.Font',
  cdnDomain: 'appcdn.wind.com.cn',
  assetPrefix: '/Wind.WFC.Enterprise.Web/PC.Front/Company/',
  retryTime: 3600 * 24,
  entryHTML: `${process.cwd()}/build/`,
  minifyHTML: true,
}

// appName：应用的唯一标识，作为日志上报的参数，请设置为软件仓库的模块名
// cdnDomain：CDN 域名，默认为 appcdn.wind.com.cn
//  assetPrefix：资源前缀，请根据项目实际情况配置，例如，我访问应用的 html 路径为：http://114.80.154.45/DataReport/cac/index.html，观察控制台，可以看到请求 css 和 js 文件都通过相同的前缀：http://114.80.154.45/DataReport/cac/。则 assetPrefix为：/DataReport/cac/。注意最后需要添加 /。
// retryTime：访问 CDN 失败后重试的时间，默认为 1 天后再通过 CDN 请求文件。
// entryHTML：本地打包后 html 文件所在的目录，如果是需要修改目录下的所有 html 文件，请传入目录，例如：`${process.cwd()}/build/`。
// minifyHTML：是否最小化 html 文件，默认为 true。
