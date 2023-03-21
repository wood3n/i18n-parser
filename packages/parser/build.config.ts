/* unbuild config */
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  // If entries is not provided, will be automatically inferred from package.json
  entries: [
    // default
    './src/index',
  ],
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      minify: true,
    },
  },
  // Change outDir, default is 'dist'
  outDir: 'lib',
  // Generates .d.ts declaration file
  declaration: false,
});
