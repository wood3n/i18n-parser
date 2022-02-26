void (async function () {
  try {
    await $`postgres -D "C:\\Program Files\\PostgreSQL\\14\\data"`;
  } catch (p) {
    console.log(`Exit code: ${p.exitCode}`);
    console.log(`Error: ${p.stderr}`);
  }
})();
