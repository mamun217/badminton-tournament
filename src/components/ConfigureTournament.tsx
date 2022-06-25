import { FormEvent, useState } from "react";
import "./ConfigureTournament.scss";
import { GAME_DEFAULT_SCORE_TO_WIN } from "../behaviors/GameUtils";
import InputCheckbox from "./InputCheckbox";

const ConfigureTournament = () => {
  // const [totalTeam, setTotalTeam] = useState(24);
  // const [totalGroup, setTotalGroup] = useState(8);
  // const [totalPool, setTotalPool] = useState(3);
  const totalTeam = 24; //For now keeping it readonly
  const totalGroup = 8; //For now keeping it readonly
  const totalPool = 3; //For now keeping it readonly
  const [groupScoreToWin, setGroupScoreToWin] = useState(
    GAME_DEFAULT_SCORE_TO_WIN
  );
  const [poolScoreToWin, setPoolScoreToWin] = useState(
    GAME_DEFAULT_SCORE_TO_WIN
  );
  const [groupNoDeuce, setGroupNoDeuce] = useState(false);
  const [poolNoDeuce, setPoolNoDeuce] = useState(false);

  const createFixture = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (totalTeam % 2 !== 0) {
      return alert("Requires even number of teams");
    }
  };

  return (
    <form onSubmit={createFixture}>
      <div className="tournament-configure-form">
        <div>
          <label htmlFor="totalTeam">Teams (can't change now)&nbsp;</label>
          <input
            name="totalTeam"
            id="totalTeam"
            type="number"
            required
            min={2}
            max={48}
            size={3}
            value={totalTeam}
          />
        </div>
        <div>
          <label htmlFor="totalGroup">Groups (can't change now)&nbsp;</label>
          <input
            name="totalGroup"
            id="totalGroup"
            type="number"
            required
            min={2}
            max={8}
            size={3}
            value={totalGroup}
          />
        </div>
        <div>
          <label htmlFor="totalPool">Pools (can't change now)&nbsp;</label>
          <input
            name="totalPool"
            id="totalPool"
            type="number"
            required
            min={2}
            max={48}
            size={3}
            value={totalPool}
          />
        </div>
        <div>
          <label htmlFor="groupScoreToWin">Score To Win (Group Matches) </label>
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
          <label htmlFor="poolScoreToWin">Score To Win (Pool Matches) </label>
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
      </div>
      <div className="buttons">
        <button type="reset">Reset</button>
        <button type="submit">Go To Fixture</button>
      </div>
    </form>
  );
};

export default ConfigureTournament;
