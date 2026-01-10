class EnsureCssContentPlugin {
  constructor(options = {}) {
    this.options = options
  }

  apply(compiler) {
    const pluginName = 'EnsureCssContentPlugin'

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE, // Run after optimizations
        },
        (assets) => {
          Object.keys(assets).forEach((filename) => {
            if (filename.endsWith('.css')) {
              const asset = assets[filename]
              const content = asset.source()

              // Check if content is empty or only whitespace
              if (!content || (typeof content === 'string' && content.trim() === '') || asset.size() === 0) {
                const newContent = '/* empty css to avoid build error */'
                // Fix: compiler.webpack.sources might be undefined in some webpack versions/configurations, use webpack from require if needed,
                // but usually compiler.webpack is available in Webpack 5.
                // However, the safer way is to use the sources from 'webpack-sources' or the webpack instance if passed.
                // Let's use the webpack instance from the compiler to be safe.
                const { RawSource } = compiler.webpack.sources
                compilation.updateAsset(filename, new RawSource(newContent))
              }
            }
          })
        }
      )
    })
  }
}

module.exports = EnsureCssContentPlugin
