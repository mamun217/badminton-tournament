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

/**
 * Root api, might be used for server helth check.
 */
app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Hello there!" });
});

/**
 * Saves a tournament configuration.
 */
app.post("/tournament/configure", (req: Request, res: Response) => {
  const data = req.body;
  const hash = createHash("sha1");
  hash.update(data.tournamentName.toLowerCase());

  // Create tournament directory. Make sure the root folders are already available
  const tournamentDir = `${path.join(
    config.dataDir,
    "tournament",
    "active",
    hash.digest("hex")
  )}`;
  fs.mkdir(tournamentDir, (error) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Directory creation unsuccessful" });
    }
  });

  // Create json file for tournament configuration. Make sure it overwrites if a file already exists
  const tournamentConfigFile = path.join(tournamentDir, "config.json");
  fs.writeFile(tournamentConfigFile, JSON.stringify(data, null, 2), (error) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Configuration file saving unsuccessful" });
    }
  });

  return res.status(200).json({ message: "Configuration saved successfully" });
});

/**
 * Fetches configuration for an active tournament.
 */
app.get("/tournament/getActiveTournament", (req: Request, res: Response) => {
  const tournamentDir = `${path.join(config.dataDir, "tournament", "active")}`;
  fs.readdir(tournamentDir, (readDirError, dirContent) => {
    if (!readDirError && dirContent.length === 1) {
      const configFilePath = `${path.join(
        tournamentDir,
        dirContent[0],
        "config.json"
      )}`;
      fs.readFile(configFilePath, "utf8", (readFileError, data) => {
        if (!readFileError) {
          return res.json(data);
        }
        return res.json("{}");
      });
    } else {
      return res.json("{}");
    }
  });
});

export default app;
