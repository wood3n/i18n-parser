const esbuild = require('esbuild');
const chalk = require('chalk');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

const startPlugin = {
  name: 'start',
  setup(build) {
    build.onStart(() => {
      console.log('compiling typescript files...');
    });
  },
};

module.exports = function (env) {
  const isDevelopment = env === 'development';
  const isProduction = env === 'production';

  return esbuild
    .build({
      entryPoints: ['scripts/index.ts'],
      bundle: true,
      minify: true,
      define: {
        'process.env.NODE_ENV': JSON.stringify(env),
      },
      platform: 'node',
      target: ['es2020', 'node12'],
      loader: {
        '.ts': 'ts',
      },
      tsconfig: 'tsconfig.json',
      plugins: [startPlugin, nodeExternalsPlugin()],
      outfile: 'build/index.js',
      watch: isDevelopment && {
        onRebuild(error, result) {
          if (error) {
            console.error(chalk.red('compiled failed:'), error);
          } else {
            console.log(chalk.green('compiled success'));
          }
        },
      }, // make esbuild listen tsfile change to rebuild automaticly
    })
    .then(() => {
      console.log(chalk.green('compiled success'));
    })
    .catch(() => process.exit(1));
};
