import cors from "cors";
import bodyParser from "body-parser";
import express, { Application } from "express";
import { Request, Response } from "express";
import { createHash } from "crypto";
import path from "path";
import fs from "fs";
import config from "./config/server-config";

const app: Application = express();

const allowedOrigins = [/http:\/\/localhost/];
app.use(cors({ origin: allowedOrigins }));
app.options("*", cors);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Hello there!" });
});

app.post("/tournament/configure", async (req: Request, res: Response) => {
  const body = req.body;

  const hash = createHash("sha1");
  hash.update(body.tournamentName.toLowerCase());

  // Create tournament directory. Make sure the root folders are already available
  const tournamentDir = `${path.join(
    config.dataDir,
    "tournament",
    hash.digest("hex")
  )}`;
  await fs.mkdir(tournamentDir, (error) => {
    if (error) {
      console.log(error);
    }
  });

  // Create json file for tournament configuration. Make sure it overwrites if a file already exists
  const tournamentConfigFile = path.join(tournamentDir, "config.json");
  await fs.writeFile(
    tournamentConfigFile,
    JSON.stringify(body, null, 2),
    (error) => {
      if (error) {
        console.log(error);
      }
    }
  );
});

export default app;
