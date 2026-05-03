import { createServer } from "https";
import { parse } from "url";
import next from "next";
import { generate } from "selfsigned";

const pems = generate([{ name: "commonName", value: "localhost" }], {
  keySize: 2048, days: 365, algorithm: "sha256",
  extensions: [{ name: "subjectAltName", altNames: [
    { type: 7, ip: "10.148.126.28" },
    { type: 7, ip: "127.0.0.1" },
    { type: 2, value: "localhost" },
  ]}],
});

const app = next({ dev: true, hostname: "0.0.0.0", port: 3000 });
const handle = app.getRequestHandler();
await app.prepare();

const server = createServer({ key: pems.private, cert: pems.cert }, async (req, res) => {
  try {
    await handle(req, res, parse(req.url, true));
  } catch (err) {
    console.error("Request error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

server.keepAliveTimeout = 60000;
server.headersTimeout = 65000;

server.listen(3000, "0.0.0.0", () => {
  console.log("");
  console.log("✅ HTTPS server running — DO NOT CLOSE THIS WINDOW");
  console.log("   https://localhost:3000");
  console.log("   https://10.148.126.28:3000  <- open on phone");
  console.log("");
});

process.on("uncaughtException", (err) => console.error("Uncaught:", err));
process.on("unhandledRejection", (err) => console.error("Unhandled:", err));
