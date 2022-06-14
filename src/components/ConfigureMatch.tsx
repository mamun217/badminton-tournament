import { ChangeEvent, FormEvent, useState } from 'react';
import ReactDOM from 'react-dom/client';
import PlayMatch from './PlayMatch';
import { GAME_DEFAULT_SCORE_TO_WIN } from '../behaviors/GameUtils';
import './ConfigureMatch.scss';
import { firstLetterUpperCase } from '../behaviors/StringUtils';

interface IConfigureMatch {
  rootElement: ReactDOM.Root;
}

interface IPlayer {
  type: string;
  name: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface INoDeuce {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface IScoreToWin {
  scoreToWin: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function InputPlayer(props: IPlayer) {
  const inputElementName = props.type + firstLetterUpperCase(props.name);
  const cssPlayerId = "id_" + props.type + "_" + props.name;
  return (
    <div>
      <label htmlFor={cssPlayerId}>{props.label}</label>
      <input id={cssPlayerId} type="text" name={inputElementName} onChange={props.onChange} required={true} />
    </div>
  );
}

function InputNoDeuce(props: INoDeuce) {
  return (
    <div className="no_deuce_items">
      <label htmlFor='no_deuce'>No deuce&nbsp;</label>
      <input type="checkbox" id="no_deuce" name="noDeuce" onChange={props.onChange} checked={props.checked} />
    </div>
  );
}

function InputScoreToWin(props: IScoreToWin) {
  return (
    <div className="score_to_win_items">
      <label htmlFor="score_to_win">Score needs to win &nbsp;</label>
      <input id="score_to_win" type="number" name="scoreToWin"
        onChange={props.onChange} defaultValue={props.scoreToWin} size={3} min={10} max={30} required={true} />
    </div>
  );
}

function ConfigureMatch(props: IConfigureMatch) {
  const formDefaultValues = {
    servingPlayer1: "",
    servingPlayer2: "",
    receivingPlayer1: "",
    receivingPlayer2: "",
    noDeuce: false,
    scoreToWin: GAME_DEFAULT_SCORE_TO_WIN
  };

  const [servingPlayer1, setServingPlayer1] = useState(formDefaultValues.servingPlayer1);
  const [servingPlayer2, setServingPlayer2] = useState(formDefaultValues.servingPlayer2);
  const [receivingPlayer1, setReceivingPlayer1] = useState(formDefaultValues.receivingPlayer1);
  const [receivingPlayer2, setReceivingPlayer2] = useState(formDefaultValues.receivingPlayer2);
  const [noDeuce, setNoDeuce] = useState(formDefaultValues.noDeuce);
  const [scoreToWin, setScoreToWin] = useState(formDefaultValues.scoreToWin);

  const startMatch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate inputs (these checks may not be needed after all).
    if (!servingPlayer1 || !servingPlayer2 || !receivingPlayer1 || !receivingPlayer2) {
      alert("Enter names of Serving and Receiving team players.");
      return;
    } else if (scoreToWin < 10 || scoreToWin > 30) {
      alert('Score needs to win must be 10 ~ 30');
      return;
    }

    // Render actual match scoring page
    props.rootElement.render(
      <PlayMatch servingPlayer1={servingPlayer1} servingPlayer2={servingPlayer2}
        receivingPlayer1={receivingPlayer1} receivingPlayer2={receivingPlayer2}
        noDeuce={noDeuce} scoreToWin={scoreToWin} />
    );
  };

  const resetMatchConfig = () => {
    setServingPlayer1(formDefaultValues.servingPlayer1);
    setServingPlayer2(formDefaultValues.servingPlayer2);
    setReceivingPlayer1(formDefaultValues.receivingPlayer1);
    setReceivingPlayer2(formDefaultValues.receivingPlayer2);
    setNoDeuce(formDefaultValues.noDeuce);
    setScoreToWin(formDefaultValues.scoreToWin);
  };

  return (
    <div id="match_config">
      <form onReset={resetMatchConfig} onSubmit={startMatch}>
        <div className="serving">
          <InputPlayer type="serving" label="Server's Name " name="player1"
            onChange={(event) => setServingPlayer1(event.target.value)} />
          <InputPlayer type="serving" label="Server's Partner Name" name="player2"
            onChange={(event) => setServingPlayer2(event.target.value)} />
        </div>
        <div className="receiving">
          <InputPlayer type="receiving" label="Receiver's Name" name="player1"
            onChange={(event) => setReceivingPlayer1(event.target.value)} />
          <InputPlayer type="receiving" label="Receiver's Partner Name" name="player2"
            onChange={(event) => setReceivingPlayer2(event.target.value)} />
        </div>
        <div className="game-options">
          <InputNoDeuce onChange={(event) => setNoDeuce(event.target.checked)}
            checked={noDeuce} />
          <InputScoreToWin scoreToWin={formDefaultValues.scoreToWin}
            onChange={(event) => setScoreToWin(parseInt(event.target.value))} />
        </div>
        <div className="buttons">
          <button type="reset">Reset</button>
          <button type="submit">Start Match</button>
        </div>
      </form >
    </div >
  );
}

export default ConfigureMatch;
