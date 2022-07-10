import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
import "./ConfigureTournament.scss";
import InputCheckbox from "./InputCheckbox";
import { GAME_DEFAULT_SCORE_TO_WIN } from "../behaviors/GameUtils";
import {
  Group,
  TournamentConfig,
  createInitialGroups,
  createMatches,
  GroupMatches,
  GroupStanding,
} from "../behaviors/TournamentUtils";
import axios from "axios";
import TournamentFixture from "./TournamentFixture";

const serverUrl = "http://localhost:8080";

const SCREEN_CONFIGURE = "configure";
const SCREEN_FIXTURE = "fixture";

const ConfigureTournament = () => {
  const [screenToDisplay, setScreenToDisplay] = useState(SCREEN_CONFIGURE);
  const [tournamentName, setTournamentName] = useState("");
  const [hasActiveTournament, setHasActiveTournament] = useState(false);
  // const [totalTeam, setTotalTeam] = useState(24);
  // const [totalGroup, setTotalGroup] = useState(8);
  // const [totalPool, setTotalPool] = useState(3);
  const numberOfTeam: number = 24; //For now keeping it readonly
  const numberOfGroup: number = 8; //For now keeping it readonly
  const numberOfPool: number = 3; //For now keeping it readonly
  const [groupScoreToWin, setGroupScoreToWin] = useState(
    GAME_DEFAULT_SCORE_TO_WIN
  );
  const [groupNoDeuce, setGroupNoDeuce] = useState(false);
  const [poolScoreToWin, setPoolScoreToWin] = useState(
    GAME_DEFAULT_SCORE_TO_WIN
  );
  const [poolNoDeuce, setPoolNoDeuce] = useState(false);
  const [groupDetail, setGroupDetail] = useState([] as Group[]);

  const createFixture = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (numberOfTeam === 1) {
      return alert("Really!! Fixture for a single team!");
    }
    if (numberOfTeam % 2 !== 0) {
      return alert("Requires even number of teams");
    }

    const groupMatches: GroupMatches = groupDetail.reduce(
      (matches, group) => ({
        ...matches,
        [group.groupName]: createMatches(group.groupName, group.teams),
      }),
      {}
    );

    const groupStanding: GroupStanding = groupDetail.reduce(
      (standing, group) => ({
        ...standing,
        [group.groupName]: group.teams.map((team) => ({
          team: team,
          matchPlayed: 0,
          matchPoint: 0,
          setPlayed: 0,
          earnedScore: 0,
          lostScore: 0,
        })),
      }),
      {}
    );

    axios
      .post(`${serverUrl}/tournament/createFixture`, {
        tournamentName: tournamentName,
        groupMatches: groupMatches,
        groupStanding: groupStanding,
      })
      .then((response) => {
        if (response.status === 200) {
          setScreenToDisplay(SCREEN_FIXTURE);
        }
      });
  };

  const configure = (event: MouseEvent) => {
    event.preventDefault();
    if (
      window.confirm(
        "Entered tournament details can't be modified once saved. Wish to continue?"
      )
    ) {
      axios
        .post(`${serverUrl}/tournament/configure`, {
          tournamentName: tournamentName,
          numberOfTeam: numberOfTeam,
          numberOfGroup: numberOfGroup,
          numberOfPool: numberOfPool,
          groupScoreToWin: groupScoreToWin,
          groupNoDeuce: groupNoDeuce,
          poolScoreToWin: poolScoreToWin,
          poolNoDeuce: poolNoDeuce,
          groups: groupDetail,
        } as TournamentConfig)
        .then((response) => {
          if (response.status === 200) {
            setHasActiveTournament(true);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleTeamNameInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    groupIndex: number,
    teamIndex: number
  ) => {
    const updatedGroups = [...groupDetail];
    updatedGroups[groupIndex].teams[teamIndex].name = event.target.value;
    setGroupDetail(updatedGroups);
  };

  const handleTeamPlayer1Input = (
    event: React.ChangeEvent<HTMLInputElement>,
    groupIndex: number,
    teamIndex: number
  ) => {
    const updatedGroups = [...groupDetail];
    updatedGroups[groupIndex].teams[teamIndex].player1 = event.target.value;
    setGroupDetail(updatedGroups);
  };

  const handleTeamPlayer2Input = (
    event: React.ChangeEvent<HTMLInputElement>,
    groupIndex: number,
    teamIndex: number
  ) => {
    const updatedGroups = [...groupDetail];
    updatedGroups[groupIndex].teams[teamIndex].player2 = event.target.value;
    setGroupDetail(updatedGroups);
  };

  const setTournamentConfigForm = (config: TournamentConfig) => {
    setTournamentName(config.tournamentName || "");
    setHasActiveTournament(config.tournamentName ? true : false);
    setGroupScoreToWin(config.groupScoreToWin || GAME_DEFAULT_SCORE_TO_WIN);
    setGroupNoDeuce(config.groupNoDeuce || false);
    setPoolScoreToWin(config.poolScoreToWin || GAME_DEFAULT_SCORE_TO_WIN);
    setPoolNoDeuce(config.poolNoDeuce || false);
    setGroupDetail(
      config.groups || createInitialGroups(numberOfTeam, numberOfGroup)
    );
  };

  /*
    Loads config and current state of the active tournament (config, match, standing etc.)
    to display in the configuration page.
   */
  useEffect(() => {
    axios
      .get(`${serverUrl}/tournament/getActiveTournament`)
      .then((response) => {
        setTournamentConfigForm(JSON.parse(response.data.config));
      });
  }, []);

  return (
    <>
      {screenToDisplay === SCREEN_FIXTURE && <TournamentFixture />}
      {screenToDisplay === SCREEN_CONFIGURE && (
        <form onSubmit={createFixture}>
          <div className="tournament-configure-form">
            <div>
              <label htmlFor="tournamentName">Tournament Name&nbsp;</label>
              <input
                name="tournamentName"
                id="tournamentName"
                type="text"
                required
                size={40}
                value={tournamentName}
                onChange={(event) => setTournamentName(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="totalTeam">Teams (can't change)&nbsp;</label>
              <input
                name="totalTeam"
                id="totalTeam"
                type="number"
                required
                min={2}
                max={48}
                size={3}
                defaultValue={numberOfTeam}
                disabled
              />
            </div>
            <div>
              <label htmlFor="totalGroup">Groups (can't change)&nbsp;</label>
              <input
                name="totalGroup"
                id="totalGroup"
                type="number"
                required
                min={2}
                max={8}
                size={3}
                defaultValue={numberOfGroup}
                disabled
              />
            </div>
            <div>
              <label htmlFor="totalPool">Pools (can't change)&nbsp;</label>
              <input
                name="totalPool"
                id="totalPool"
                type="number"
                required
                min={2}
                max={48}
                size={3}
                defaultValue={numberOfPool}
                disabled
              />
            </div>
            <div>
              <label htmlFor="groupScoreToWin">
                Score To Win (Group Matches){" "}
              </label>
              <input
                name="groupScoreToWin"
                id="groupScoreToWin"
                type="number"
                required
                min={10}
                max={30}
                size={3}
                value={groupScoreToWin}
                onChange={(event) =>
                  setGroupScoreToWin(parseInt(event.target.value))
                }
              />
              <InputCheckbox
                label="No Deuce (Group Matches)"
                name="groupNoDeuce"
                onChange={(event) => setGroupNoDeuce(event.target.checked)}
                checked={groupNoDeuce}
              />
            </div>
            <div>
              <label htmlFor="poolScoreToWin">
                Score To Win (Pool Matches){" "}
              </label>
              <input
                name="poolScoreToWin"
                id="poolScoreToWin"
                type="number"
                required
                min={10}
                max={30}
                size={3}
                value={poolScoreToWin}
                onChange={(event) =>
                  setPoolScoreToWin(parseInt(event.target.value))
                }
              />
              <InputCheckbox
                label="No Deuce (Pool Matches)"
                name="poolNoDeuce"
                onChange={(event) => setPoolNoDeuce(event.target.checked)}
                checked={poolNoDeuce}
              />
            </div>
            <div className="group-input-container">
              {groupDetail.map((group, groupIndex) => {
                return (
                  <div className="group-input" key={groupIndex}>
                    <div className="group-input-header">{group.groupName}</div>
                    {group.teams.map((team, teamIndex) => {
                      return (
                        <div className="team-input" key={teamIndex}>
                          <input
                            type="text"
                            name="name"
                            value={team.name}
                            placeholder={team.name || "Enter team name"}
                            onChange={(e) =>
                              handleTeamNameInput(e, groupIndex, teamIndex)
                            }
                          />
                          <input
                            type="text"
                            name="player1"
                            value={team.player1}
                            placeholder={team.player1 || "Enter player 1"}
                            onChange={(e) =>
                              handleTeamPlayer1Input(e, groupIndex, teamIndex)
                            }
                          />
                          <input
                            type="text"
                            name="player2"
                            value={team.player2}
                            placeholder={team.player2 || "Enter player 2"}
                            onChange={(e) =>
                              handleTeamPlayer2Input(e, groupIndex, teamIndex)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="buttons">
            {!hasActiveTournament && (
              <>
                <button type="reset">Reset</button>
                <button onClick={(e) => configure(e)}>Configure</button>
              </>
            )}
            <button type="submit">Fixture</button>
          </div>
        </form>
      )}
    </>
  );
};

export default ConfigureTournament;
