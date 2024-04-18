const config = require("../config/default.json");
const app = require("../app");

const port = process.env.PORT || config.get("port");
app.set("port", port);
const http = require("http");
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

server.on("error", (error) => {
  console.error(error);
});

// server.on("listening", () => {
//   console.log(`Server is listening on port: ${port}`);
// });
