import config from "./config/server-config";
import app from "./application";

app.listen(config.port, () => {
  console.log(`Server started at http://localhost:${config.port}`);
});
