import { useState, MouseEventHandler, useEffect } from 'react';
import './Match.css';
import { isGameWon } from '../behaviors/GameUtils';
import undoImage from '../images/undo.png';
import resetImage from '../images/reset.png';
import shuttleImage from '../images/shuttlecock.png';

const SERVER_RECEIVER_BACKGROUND_CSS_CLASS = "server_receiver_background";

interface IPlayerShuttle {
  displayShuttle: boolean;
  elementId: string;
}

interface IGame {
  gameNumber: number;
  teamScore: number;
  opponentScore: number;
  gameTime: string;
}

interface IGameWonByTeam {
  teamId: number;
  listOfGameWon: IGame[];
}

interface IPlayer {
  teamId: number;
  playerId: number;
  playerName: string;
  backgroundColorClass: string;
  displayShuttle: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}

interface IMatch {
  servingPlayer1: string;
  servingPlayer2: string;
  receivingPlayer1: string;
  receivingPlayer2: string;
  readonly noDeuce: boolean;
  readonly scoreToWin: number;
}

function padTime(timeValue: number) {
  return String(timeValue).padStart(2, "0");
}

function getCurrentGameTime(argTimeElapsedSeconds: number) {
  const minute = Math.floor(argTimeElapsedSeconds / 60);
  const second = Math.floor(argTimeElapsedSeconds % 60);
  return (padTime(minute) + ":" + padTime(second));
}

function PlayerShuttle(props: IPlayerShuttle) {
  return (
    (props.displayShuttle) ?
      (<p id={props.elementId}><img src={shuttleImage} alt="Server's shuttle" /></p>) : <></>
  );
}

function GameWonByTeam(props: IGameWonByTeam) {
  return (
    <>
      {(props.listOfGameWon.length > 0) &&
        (
          props.listOfGameWon.map((game) => {
            return (
              <div className='won_game_container' key={game.gameNumber}>
                <label className='game_score_display'>{game.teamScore}-{game.opponentScore}</label>
                <label className="game_number_display">{game.gameNumber}</label>
                <label className='game_time_display'>{game.gameTime}</label>
              </div>
            )
          })
        )}
    </>
  );
}

function Player(props: IPlayer) {
  const teamId = "team" + props.teamId;
  const playerId = "player" + props.playerId;
  const mainDivElementId = teamId + "_" + playerId;
  const teamPlayerNameElementId = mainDivElementId + "_name";
  const teamPlayerShuttleElementId = mainDivElementId + "_shuttle";
  const teamClass = (props.backgroundColorClass) ? `${teamId} ${props.backgroundColorClass}` : teamId;

  return (
    <div className={teamClass} onClick={props.onClick}>
      <div id={mainDivElementId}>
        {(props.teamId === 2) && <PlayerShuttle displayShuttle={props.displayShuttle} elementId={teamPlayerShuttleElementId} />}
        <p id={teamPlayerNameElementId}>{props.playerName}</p>
        {(props.teamId === 1) && <PlayerShuttle displayShuttle={props.displayShuttle} elementId={teamPlayerShuttleElementId} />}
      </div>
    </div>
  );
}

function Match(props: IMatch) {
  const initialState = {
    matchWon: false,
    gameInProgress: 1,
    team1Won: false,
    team2Won: false,
    team1WonGames: [] as IGame[],
    team2WonGames: [] as IGame[],
    team1Score: 0,
    team2Score: 0,
    serverTeamId: 1,
    receiverTeamId: 2,
    serverOrReceiverPlayerId: 1,
    team1Player1: props.servingPlayer1,
    displayTeam1Player1Shuttle: true,
    team1Player1backgroundColorClass: SERVER_RECEIVER_BACKGROUND_CSS_CLASS,
    team1Player2: props.servingPlayer2,
    displayTeam1Player2Shuttle: false,
    team1Player2backgroundColorClass: "",
    team2Player1: props.receivingPlayer1,
    displayTeam2Player1Shuttle: false,
    team2Player1backgroundColorClass: SERVER_RECEIVER_BACKGROUND_CSS_CLASS,
    team2Player2: props.receivingPlayer2,
    displayTeam2Player2Shuttle: false,
    team2Player2backgroundColorClass: "",
  };

  const [matchWon, setMatchWon] = useState(initialState.matchWon);
  const [timeElapsedSeconds, setTimeElapsedSeconds] = useState(0);
  const [gameInProgress, setGameInProgress] = useState(initialState.gameInProgress);
  const [team1Won, setTeam1Won] = useState(initialState.team1Won);
  const [team2Won, setTeam2Won] = useState(initialState.team2Won);
  const [team1WonGames, setTeam1WonGames] = useState(initialState.team1WonGames);
  const [team2WonGames, setTeam2WonGames] = useState(initialState.team2WonGames);
  const [team1Score, setTeam1Score] = useState(initialState.team1Score);
  const [team2Score, setTeam2Score] = useState(initialState.team2Score);
  const [serverTeamId, setServerTeamId] = useState(initialState.serverTeamId);
  const [receiverTeamId, setReceiverTeamId] = useState(initialState.receiverTeamId);
  const [serverOrReceiverPlayerId, setServerOrReceiverPlayerId] = useState(initialState.serverOrReceiverPlayerId);
  const [team1Player1, setTeam1Player1] = useState(initialState.team1Player1);
  const [displayTeam1Player1Shuttle, setDisplayTeam1Player1Shuttle] = useState(initialState.displayTeam1Player1Shuttle);
  const [team1Player1backgroundColorClass, setTeam1Player1backgroundColorClass] = useState(initialState.team1Player1backgroundColorClass);
  const [team1Player2, setTeam1Player2] = useState(initialState.team1Player2);
  const [displayTeam1Player2Shuttle, setDisplayTeam1Player2Shuttle] = useState(initialState.displayTeam1Player2Shuttle);
  const [team1Player2backgroundColorClass, setTeam1Player2backgroundColorClass] = useState(initialState.team1Player2backgroundColorClass);
  const [team2Player1, setTeam2Player1] = useState(initialState.team2Player1);
  const [displayTeam2Player1Shuttle, setDisplayTeam2Player1Shuttle] = useState(initialState.displayTeam2Player1Shuttle);
  const [team2Player1backgroundColorClass, setTeam2Player1backgroundColorClass] = useState(initialState.team2Player1backgroundColorClass);
  const [team2Player2, setTeam2Player2] = useState(initialState.team2Player2);
  const [displayTeam2Player2Shuttle, setDisplayTeam2Player2Shuttle] = useState(initialState.displayTeam2Player2Shuttle);
  const [team2Player2backgroundColorClass, setTeam2Player2backgroundColorClass] = useState(initialState.team2Player2backgroundColorClass);
  const [previousState, setPreviousState] = useState(Object.assign({}, initialState));

  /**
   * Stores previous state of the game
   */
  const savePreviousState = () => {
    setPreviousState({
      ...previousState,
      matchWon,
      gameInProgress,
      team1Won,
      team2Won,
      team1WonGames,
      team2WonGames,
      team1Score,
      team2Score,
      team1Player1,
      displayTeam1Player1Shuttle,
      team1Player1backgroundColorClass,
      team1Player2,
      displayTeam1Player2Shuttle,
      team1Player2backgroundColorClass,
      team2Player1,
      displayTeam2Player1Shuttle,
      team2Player1backgroundColorClass,
      team2Player2,
      displayTeam2Player2Shuttle,
      team2Player2backgroundColorClass,
      serverTeamId,
      receiverTeamId,
      serverOrReceiverPlayerId,
    });
  };

  /*
   * Keeps total time of a game 
   */
  useEffect(() => {
    const gameTimer = setInterval(() => {
      setTimeElapsedSeconds(timeElapsedSeconds + 1);
    }, 1000);
    (team1Won || team2Won) && clearInterval(gameTimer);

    return () => clearInterval(gameTimer);
  }, [timeElapsedSeconds, team1Won, team2Won]);

  /**
   * Toggles team or player id
   * @param {number} currentId - 1 or 2
   * @returns 1 if given current id is 2, 2 otherwise
   */
  const toggleTeamOrPlayer = (currentId: number) => {
    return (currentId === 1) ? 2 : 1;
  };

  /**
   * 
   * @param {number} score - Team's score
   * @returns Player ID 1 if score is even, 2 otherwise.
   */
  const getServerOrReceiverPlayerIdByScore = (score: number) => {
    return (score % 2 === 0) ? 1 : 2;
  };

  const updateTeamScore = (teamId: number) => {
    let team1LatestScore = team1Score;
    let team2LatestScore = team2Score;
    if (teamId === 1) {
      team1LatestScore = team1LatestScore + 1;
      setTeam1Score(team1LatestScore);
    } else {
      team2LatestScore = team2LatestScore + 1;
      setTeam2Score(team2LatestScore);
    }
    return [team1LatestScore, team2LatestScore];
  };

  const setServerReceiverBackgroundColor = (playerId: number) => {
    if (playerId === 1) {
      setTeam1Player1backgroundColorClass(SERVER_RECEIVER_BACKGROUND_CSS_CLASS);
      setTeam1Player2backgroundColorClass("");
      setTeam2Player1backgroundColorClass(SERVER_RECEIVER_BACKGROUND_CSS_CLASS);
      setTeam2Player2backgroundColorClass("");
    } else {
      setTeam1Player1backgroundColorClass("");
      setTeam1Player2backgroundColorClass(SERVER_RECEIVER_BACKGROUND_CSS_CLASS);
      setTeam2Player1backgroundColorClass("");
      setTeam2Player2backgroundColorClass(SERVER_RECEIVER_BACKGROUND_CSS_CLASS);
    }
  };

  const setServerShuttle = (teamId: number, playerId: number) => {
    setDisplayTeam1Player1Shuttle(false);
    setDisplayTeam1Player2Shuttle(false);
    setDisplayTeam2Player1Shuttle(false);
    setDisplayTeam2Player2Shuttle(false);

    if (teamId === 1) {
      (playerId === 1) && setDisplayTeam1Player1Shuttle(true);
      (playerId === 2) && setDisplayTeam1Player2Shuttle(true);
      return;
    }

    (playerId === 1) && setDisplayTeam2Player1Shuttle(true);
    (playerId === 2) && setDisplayTeam2Player2Shuttle(true);
  };

  /**
   * Swaps team players on every score team makes after their first turn in serving.
   * 
   * @param {number} teamId - 1 or 2
   * @returns Nothing
   */
  const changePlayersSide = (teamId: number) => {
    if (serverTeamId !== teamId) {
      return;
    }

    if (teamId === 1) {
      let temp = team1Player1;
      setTeam1Player1(team1Player2);
      setTeam1Player2(temp);
    } else {
      let temp = team2Player1;
      setTeam2Player1(team2Player2);
      setTeam2Player2(temp);
    }
  };

  const changeServerAndReceiver = (idOfTeamEarnedThePoint: number, latestScoreOfTheTeam: number) => {
    let toBeServerTeamId = idOfTeamEarnedThePoint;
    let toBeReceiverTeamId = toggleTeamOrPlayer(idOfTeamEarnedThePoint);
    let toBePlayerIdServerOrReceiver;

    if (serverTeamId === idOfTeamEarnedThePoint) {
      toBePlayerIdServerOrReceiver = toggleTeamOrPlayer(serverOrReceiverPlayerId);
    } else {
      setServerTeamId(toBeServerTeamId);
      setReceiverTeamId(toBeReceiverTeamId);
      toBePlayerIdServerOrReceiver = getServerOrReceiverPlayerIdByScore(latestScoreOfTheTeam);
    }
    setServerOrReceiverPlayerId(toBePlayerIdServerOrReceiver);

    setServerReceiverBackgroundColor(toBePlayerIdServerOrReceiver);
    setServerShuttle(toBeServerTeamId, toBePlayerIdServerOrReceiver);
  }

  const determineMatchResult = (argTeamId: number, argTeam1WinCount: number, argTeam2WinCount: number): boolean => {
    const isMatchWon = ((argTeamId === 1) ? argTeam1WinCount === 2 : argTeam2WinCount === 2);
    if (isMatchWon) {
      setMatchWon(isMatchWon);
      const teamPlayers = (argTeamId === 1) ? `${team1Player1} & ${team1Player2}` : `${team2Player1} & ${team2Player2}`;
      alert(`${teamPlayers} have won the match!`);
      return true;
    }
    return false;
  }

  const setGameWinner = (argTeamId: number, argTeam1Score: number, argTeam2Score: number) => {
    const game: IGame = {
      gameNumber: gameInProgress,
      teamScore: 0,
      opponentScore: 0,
      gameTime: getCurrentGameTime(timeElapsedSeconds),
    };
    let team1WinCount = team1WonGames.length;
    let team2WinCount = team2WonGames.length;
    if (argTeamId === 1) {
      setTeam1Won(true);
      team1WinCount++;
      game.teamScore = argTeam1Score;
      game.opponentScore = argTeam2Score;
      setTeam1WonGames(prev => [...prev, game]);
    }
    else {
      setTeam2Won(true);
      team2WinCount++;
      game.teamScore = argTeam2Score;
      game.opponentScore = argTeam1Score;
      setTeam2WonGames(prev => [...prev, game]);
    }

    const isMatchWon = determineMatchResult(argTeamId, team1WinCount, team2WinCount);
    if (!isMatchWon) {
      const teamPlayers = (argTeamId === 1) ? `${team1Player1} & ${team1Player2}` : `${team2Player1} & ${team2Player2}`;
      alert(`${teamPlayers} have won the game!`);
      setGameInProgress(gameInProgress + 1);
    }
  };

  const addPointToTeam = (teamId: number) => {
    if (team1Won || team2Won) {
      return;
    }

    // Save previous state for undoing
    savePreviousState();

    // Add score to the team
    const [team1LatestScore, team2LatestScore] = updateTeamScore(teamId);

    // Change player side in the court if same team scored
    changePlayersSide(teamId);

    // Change server and receiver court, color and shuttle display
    const currentTeamLatestScore = (teamId === 1) ? team1LatestScore : team2LatestScore;
    changeServerAndReceiver(teamId, currentTeamLatestScore);

    // Check if any team won the game with the current score
    if (teamId === isGameWon(team1LatestScore, team2LatestScore, props.noDeuce, props.scoreToWin)) {
      setGameWinner(teamId, team1LatestScore, team2LatestScore);
    }
  };

  const undoScore = () => {
    if (window.confirm("Wish to go back to previous state of the game?")) {
      setMatchWon(previousState.matchWon);
      setGameInProgress(previousState.gameInProgress);
      setTeam1Won(previousState.team1Won);
      setTeam2Won(previousState.team2Won);
      setTeam1WonGames(previousState.team1WonGames);
      setTeam2WonGames(previousState.team2WonGames);
      setTeam1Score(previousState.team1Score);
      setTeam2Score(previousState.team2Score);
      setTeam1Player1(previousState.team1Player1);
      setDisplayTeam1Player1Shuttle(previousState.displayTeam1Player1Shuttle);
      setTeam1Player1backgroundColorClass(previousState.team1Player1backgroundColorClass);
      setTeam1Player2(previousState.team1Player2);
      setDisplayTeam1Player2Shuttle(previousState.displayTeam1Player2Shuttle);
      setTeam1Player2backgroundColorClass(previousState.team1Player2backgroundColorClass);
      setTeam2Player1(previousState.team2Player1);
      setDisplayTeam2Player1Shuttle(previousState.displayTeam2Player1Shuttle);
      setTeam2Player1backgroundColorClass(previousState.team2Player1backgroundColorClass);
      setTeam2Player2(previousState.team2Player2);
      setDisplayTeam2Player2Shuttle(previousState.displayTeam2Player2Shuttle);
      setTeam2Player2backgroundColorClass(previousState.team2Player2backgroundColorClass);
      setServerTeamId(previousState.serverTeamId);
      setReceiverTeamId(previousState.receiverTeamId);
      setServerOrReceiverPlayerId(previousState.serverOrReceiverPlayerId);
    }
  };

  const resetGame = () => {
    if (matchWon) {
      alert("This match has a result already. Good time to have some rest!");
      return;
    }

    if (window.confirm("Wish to start a new game?")) {
      setTimeElapsedSeconds(0);
      setTeam1Won(initialState.team1Won);
      setTeam2Won(initialState.team2Won);
      setTeam1Score(initialState.team1Score);
      setTeam2Score(initialState.team2Score);
      setServerTeamId(initialState.serverTeamId);
      setReceiverTeamId(initialState.receiverTeamId);
      setServerOrReceiverPlayerId(initialState.serverOrReceiverPlayerId);
      setTeam1Player1(initialState.team1Player1);
      setDisplayTeam1Player1Shuttle(initialState.displayTeam1Player1Shuttle);
      setTeam1Player1backgroundColorClass(initialState.team1Player1backgroundColorClass);
      setTeam1Player2(initialState.team1Player2);
      setDisplayTeam1Player2Shuttle(initialState.displayTeam1Player2Shuttle);
      setTeam1Player2backgroundColorClass(initialState.team1Player2backgroundColorClass);
      setTeam2Player1(initialState.team2Player1);
      setDisplayTeam2Player1Shuttle(initialState.displayTeam2Player1Shuttle);
      setTeam2Player1backgroundColorClass(initialState.team2Player1backgroundColorClass);
      setTeam2Player2(initialState.team2Player2);
      setDisplayTeam2Player2Shuttle(initialState.displayTeam2Player2Shuttle);
      setTeam2Player2backgroundColorClass(initialState.team2Player2backgroundColorClass);
      setPreviousState(Object.assign({}, initialState));
    }
  };

  return (
    <div className="match_score">
      <div className="court_side_1">
        <Player teamId={1} playerId={1} playerName={team1Player1}
          displayShuttle={displayTeam1Player1Shuttle}
          backgroundColorClass={team1Player1backgroundColorClass}
          onClick={() => addPointToTeam(1)} />
        <Player teamId={2} playerId={2} playerName={team2Player2}
          backgroundColorClass={team2Player2backgroundColorClass}
          displayShuttle={displayTeam2Player2Shuttle}
          onClick={() => addPointToTeam(2)} />
      </div>
      <div className="score_box">
        <div id="team1_won_game"><GameWonByTeam teamId={1} listOfGameWon={team1WonGames} /></div>
        <div id="team1_score">{team1Score}</div>
        <div className="undo" onClick={undoScore}>
          <img src={undoImage} alt="Goes back to immediate previous state of the game."
            title="Goes back to immediate previous state of the game." />
        </div>
        <div id="game_time">{getCurrentGameTime(timeElapsedSeconds)}</div>
        <div className="reset" onClick={resetGame}>
          <img src={resetImage} alt="Resets the game. This will add a new set to the match."
            title="Resets the game. This will add a new set to the match." />
        </div>
        <div id="team2_score">{team2Score}</div>
        <div id="team2_won_game"><GameWonByTeam teamId={2} listOfGameWon={team2WonGames} /></div>
      </div>
      <div className="court_side_2">
        <Player teamId={1} playerId={2} playerName={team1Player2}
          displayShuttle={displayTeam1Player2Shuttle}
          backgroundColorClass={team1Player2backgroundColorClass}
          onClick={() => addPointToTeam(1)} />
        <Player teamId={2} playerId={1} playerName={team2Player1}
          displayShuttle={displayTeam2Player1Shuttle}
          backgroundColorClass={team2Player1backgroundColorClass}
          onClick={() => addPointToTeam(2)} />
      </div>
    </div>
  );
}

export default Match;
