void (async function () {
  try {
    await $`npm config set registry=https://registry.npmjs.org`;
    await $`pnpm build`;
    await $`pnpm publish --access public --filter sugar18 --no-git-checks`;
  } catch (p) {
    console.log(`Exit code: ${p.exitCode}`);
    console.log(`Error: ${p.stderr}`);
  }
})();
