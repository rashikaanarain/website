const environment = { ...process.env, NODE_ENV: "development" };
const api = Bun.spawn(["bun", "--watch", "server/index.js"], { stdout: "inherit", stderr: "inherit", env: environment });
const web = Bun.spawn(["bun", "run", "dev:web"], { stdout: "inherit", stderr: "inherit", env: environment });

function stop() {
  api.kill();
  web.kill();
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

await Promise.race([api.exited, web.exited]);
stop();
