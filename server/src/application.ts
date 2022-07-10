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

/*
 * Global constants. Some might be used in frontend components too so needs to be in sync.
 */

const MATCH_TYPE_GROUP = "Group";
const MATCH_TYPE_POOL = "Pool";

/**
 * Root api, might be used for server helth check.
 */
app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Hello there!" });
});

/**
 * Saves a tournament basic configuration.
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
 * Creates tournament fixture
 */
app.post("/tournament/createFixture", (req: Request, res: Response) => {
  // If an active tournament is already available then return that tournament.
  const tournamentData = getActiveTournament();
  if (tournamentData) {
    return res.status(200).json({ config: tournamentData });
  }

  // If no active tournament found then create a new tournament.
  const data = req.body;
  const hash = createHash("sha1");
  hash.update(data.tournamentName.toLowerCase());
  const configFilePath = `${path.join(
    config.dataDir,
    "tournament",
    "active",
    hash.digest("hex"),
    "config.json"
  )}`;
  fs.readFile(configFilePath, "utf8", (error, configData) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Not able to read tournament configuration file" });
    }
    const config = JSON.parse(configData);
    config.groupMatches = data.groupMatches;
    config.groupStanding = data.groupStanding;

    fs.writeFile(configFilePath, JSON.stringify(config, null, 2), (error) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ message: "Configuration file saving unsuccessful" });
      }

      return res.status(200).json({ config: config });
    });
  });
});

app.post("/tournament/saveMatchResult", (req: Request, res: Response) => {
  const data = req.body;
  const tournamentData = getActiveTournament();
  if (tournamentData) {
    const tournamentConfig = JSON.parse(tournamentData);
    if (data.matchId.startsWith(MATCH_TYPE_GROUP)) {
      const match = getMatch(data.matchId, tournamentConfig.groupMatches);
      if (match) {
        match.winner = data.winnerTeamId;
        saveActiveTournament(tournamentConfig);
      }
    } else if (data.matchId.startsWith(MATCH_TYPE_POOL)) {
    }

    return res
      .status(200)
      .json({ config: JSON.stringify(tournamentConfig, null, 2) });
  }
  return res.status(200).json({ config: "{}" });
});

/**
 * Fetches configuration for an active tournament.
 */
app.get("/tournament/getActiveTournament", (req: Request, res: Response) => {
  const tournamentData = getActiveTournament();
  if (tournamentData) {
    return res.json({ config: tournamentData });
  }
  return res.json({ config: {} });
});

const getActiveTournament = (): string => {
  const tournamentDir = `${path.join(config.dataDir, "tournament", "active")}`;
  const dirContent = fs.readdirSync(tournamentDir);
  let tournamentData: string = "";
  if (dirContent.length === 1) {
    const configFilePath = `${path.join(
      tournamentDir,
      dirContent[0],
      "config.json"
    )}`;
    tournamentData = fs.readFileSync(configFilePath, "utf8");
  }

  return tournamentData;
};

const saveActiveTournament = (tournamentConfig: object) => {
  const tournamentDir = `${path.join(config.dataDir, "tournament", "active")}`;
  const dirContent = fs.readdirSync(tournamentDir);
  if (dirContent.length === 1) {
    const configFilePath = `${path.join(
      tournamentDir,
      dirContent[0],
      "config.json"
    )}`;
    fs.writeFileSync(configFilePath, JSON.stringify(tournamentConfig, null, 2));
  }
};

const getMatch = (matchId: string, matches: any): any => {
  if (Array.isArray(matches)) {
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].matchId === matchId) {
        return matches[i];
      }
    }
    return null;
  }

  for (const key in matches) {
    return getMatch(matchId, matches[key]);
  }
};

export default app;
