const esbuild = require("esbuild");
const chalk = require("chalk");
const { nodeExternalsPlugin } = require("esbuild-node-externals");

function build() {
  const { watch } = require("minimist")(process.argv.slice(2));

  const config = {
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: !watch,
    platform: "node",
    sourcemap: true,
    target: ["node14"],
    loader: {
      ".ts": "ts",
    },
    tsconfig: "./tsconfig.json",
    plugins: [nodeExternalsPlugin()],
    outfile: "./lib/index.js",
    sourcemap: true,
    external: ["vscode"],
  };

  if (watch) {
    config.watch = {
      onRebuild(error) {
        if (error) console.error("watch build failed:", error);
        else console.log("watch build succeeded");
      },
    };
  }

  esbuild
    .build(config)
    .then(() => {
      console.log(chalk.green("compiled success"));
    })
    .catch((err) => {
      console.log(chalk.red("compiled failed"));
      console.log();
      console.log(err);
      process.exit(1);
    });
}

build();
