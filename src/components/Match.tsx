import { useState, MouseEventHandler, useEffect } from 'react';
import './Match.css';
import * as GameUtils from '../behaviors/GameUtils';
import * as MatchUtils from '../behaviors/MatchUtils';
import undoImage from '../images/undo.png';
import resetImage from '../images/reset.png';
import shuttleImage from '../images/shuttlecock.png';

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
    gameScore: [0, 0],
    gameWon: [false, false],
    team1WonGames: [] as IGame[],
    team2WonGames: [] as IGame[],
    serverTeamId: 1 as GameUtils.TeamOrPlayerId,
    receiverTeamId: 2 as GameUtils.TeamOrPlayerId,
    serverOrReceiverPlayerId: 1 as GameUtils.TeamOrPlayerId,
    team1Players: [props.servingPlayer1, props.servingPlayer2],
    team1PlayersShuttleDisplay: [true, false],
    team1PlayersBackgroundColorClass: [GameUtils.SERVER_RECEIVER_BACKGROUND_CSS_CLASS, ''],
    team2Players: [props.receivingPlayer1, props.receivingPlayer2],
    team2PlayersShuttleDisplay: [false, false],
    team2PlayersBackgroundColorClass: [GameUtils.SERVER_RECEIVER_BACKGROUND_CSS_CLASS, ''],
  };

  const [matchWon, setMatchWon] = useState(initialState.matchWon);
  const [timeElapsedSeconds, setTimeElapsedSeconds] = useState(0);
  const [gameInProgress, setGameInProgress] = useState(initialState.gameInProgress);
  const [gameScore, setGameScore] = useState(initialState.gameScore);
  const [gameWon, setGameWon] = useState(initialState.gameWon);
  const [team1WonGames, setTeam1WonGames] = useState(initialState.team1WonGames);
  const [team2WonGames, setTeam2WonGames] = useState(initialState.team2WonGames);
  const [serverTeamId, setServerTeamId] = useState(initialState.serverTeamId);
  const [receiverTeamId, setReceiverTeamId] = useState(initialState.receiverTeamId);
  const [serverOrReceiverPlayerId, setServerOrReceiverPlayerId] = useState(initialState.serverOrReceiverPlayerId);
  const [team1Players, setTeam1Players] = useState(initialState.team1Players);
  const [team1PlayersShuttleDisplay, setTeam1PlayersShuttleDisplay] = useState(initialState.team1PlayersShuttleDisplay);
  const [team1PlayersBackgroundColorClass, setTeam1PlayersBackgroundColorClass] = useState(initialState.team1PlayersBackgroundColorClass);
  const [team2Players, setTeam2Players] = useState(initialState.team2Players);
  const [team2PlayersShuttleDisplay, setTeam2PlayersShuttleDisplay] = useState(initialState.team2PlayersShuttleDisplay);
  const [team2PlayersBackgroundColorClass, setTeam2PlayersBackgroundColorClass] = useState(initialState.team2PlayersBackgroundColorClass);
  const [previousState, setPreviousState] = useState(Object.assign({}, initialState));

  /**
   * Stores previous state of the game
   */
  const savePreviousState = () => {
    setPreviousState({
      ...previousState,
      matchWon,
      gameInProgress,
      gameScore,
      gameWon,
      team1WonGames,
      team2WonGames,
      team1Players,
      team1PlayersShuttleDisplay,
      team1PlayersBackgroundColorClass,
      team2Players,
      team2PlayersShuttleDisplay,
      team2PlayersBackgroundColorClass,
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
    (gameWon[0] || gameWon[1]) && clearInterval(gameTimer);

    return () => clearInterval(gameTimer);
  }, [timeElapsedSeconds, gameWon]);

  const updateTeamScore = (teamId: GameUtils.TeamOrPlayerId) => {
    const latestGameScore = Object.assign([] as number[], gameScore);
    latestGameScore[teamId - 1] = latestGameScore[teamId - 1] + 1;
    setGameScore(latestGameScore);
    return latestGameScore;
  };

  const setServerReceiverBackgroundColor = (playerId: GameUtils.TeamOrPlayerId) => {
    const tempTeam1PlayersBackgroundColorClass = ['', ''];
    const tempTeam2PlayersBackgroundColorClass = ['', ''];

    tempTeam1PlayersBackgroundColorClass[playerId - 1] = GameUtils.SERVER_RECEIVER_BACKGROUND_CSS_CLASS;
    tempTeam2PlayersBackgroundColorClass[playerId - 1] = GameUtils.SERVER_RECEIVER_BACKGROUND_CSS_CLASS;

    setTeam1PlayersBackgroundColorClass(tempTeam1PlayersBackgroundColorClass);
    setTeam2PlayersBackgroundColorClass(tempTeam2PlayersBackgroundColorClass);
  };

  const setServerShuttle = (teamId: GameUtils.TeamOrPlayerId, playerId: GameUtils.TeamOrPlayerId) => {
    const tempTeam1PlayersShuttleDisplay = [false, false];
    const tempTeam2PlayersShuttleDisplay = [false, false];

    (teamId === 1) ? (tempTeam1PlayersShuttleDisplay[playerId - 1] = true) : (tempTeam2PlayersShuttleDisplay[playerId - 1] = true);

    setTeam1PlayersShuttleDisplay(tempTeam1PlayersShuttleDisplay);
    setTeam2PlayersShuttleDisplay(tempTeam2PlayersShuttleDisplay);
  };

  /**
   * Swaps team players on every score team makes after their first turn in serving.
   * 
   * @param {GameUtils.TeamOrPlayerId} teamId - 1 or 2
   * @returns Nothing
   */
  const changePlayersSide = (teamId: GameUtils.TeamOrPlayerId) => {
    if (serverTeamId !== teamId) {
      return;
    }

    (teamId === 1) ? setTeam1Players([team1Players[1], team1Players[0]]) : setTeam2Players([team2Players[1], team2Players[0]]);
  };

  const changeServerAndReceiver = (idOfTeamEarnedThePoint: GameUtils.TeamOrPlayerId) => {
    const nextServerAndReceiver = GameUtils.determineNextServerAndReceiver(idOfTeamEarnedThePoint,
      serverTeamId, serverOrReceiverPlayerId, gameScore[0], gameScore[1]);
    if (serverTeamId !== idOfTeamEarnedThePoint) {
      setServerTeamId(nextServerAndReceiver.serverTeamId);
      setReceiverTeamId(nextServerAndReceiver.receiverTeamId);
    }

    setServerOrReceiverPlayerId(nextServerAndReceiver.serverAndReceiverPlayerId);
    setServerReceiverBackgroundColor(nextServerAndReceiver.serverAndReceiverPlayerId);
    setServerShuttle(nextServerAndReceiver.serverTeamId, nextServerAndReceiver.serverAndReceiverPlayerId);
  }

  const setGameWinner = (argTeamId: GameUtils.TeamOrPlayerId, argTeam1Score: number, argTeam2Score: number) => {
    const game: IGame = {
      gameNumber: gameInProgress,
      teamScore: 0,
      opponentScore: 0,
      gameTime: getCurrentGameTime(timeElapsedSeconds),
    };

    let tempGameWon = Object.assign([] as boolean[], initialState.gameWon);
    tempGameWon[argTeamId - 1] = true;
    setGameWon(tempGameWon);

    let team1WinCount = team1WonGames.length;
    let team2WinCount = team2WonGames.length;
    if (argTeamId === 1) {
      team1WinCount++;
      game.teamScore = argTeam1Score;
      game.opponentScore = argTeam2Score;
      setTeam1WonGames(prev => [...prev, game]);
    } else {
      team2WinCount++;
      game.teamScore = argTeam2Score;
      game.opponentScore = argTeam1Score;
      setTeam2WonGames(prev => [...prev, game]);
    }

    const teamPlayers = (argTeamId === 1) ? `${team1Players[0]} & ${team1Players[1]}` : `${team2Players[0]} & ${team2Players[1]}`;
    const matchResult = MatchUtils.determineMatchResult(team1WinCount, team2WinCount);
    if (matchResult !== 0) { // If a team won the match
      setMatchWon(true);
      alert(`${teamPlayers} have won the match!`);
      return;
    }

    alert(`${teamPlayers} have won the game!`);
    setGameInProgress(gameInProgress + 1);
  };

  const addPointToTeam = (teamId: GameUtils.TeamOrPlayerId) => {
    if (gameWon[0] || gameWon[1]) {
      return;
    }

    // Save previous state for undoing
    savePreviousState();

    // Add score to the team
    const [team1LatestScore, team2LatestScore] = updateTeamScore(teamId);

    // Change player side in the court if same team scored
    changePlayersSide(teamId);

    // Change server and receiver court, color and shuttle display
    changeServerAndReceiver(teamId);

    // Check if any team won the game with the current score
    if (teamId === GameUtils.isGameWon(team1LatestScore, team2LatestScore, props.noDeuce, props.scoreToWin)) {
      setGameWinner(teamId, team1LatestScore, team2LatestScore);
    }
  };

  const undoScore = () => {
    if (window.confirm("Wish to go back to previous state of the game?")) {
      setMatchWon(previousState.matchWon);
      setGameInProgress(previousState.gameInProgress);
      setGameScore(previousState.gameScore);
      setGameWon(previousState.gameWon);
      setTeam1WonGames(previousState.team1WonGames);
      setTeam2WonGames(previousState.team2WonGames);
      setTeam1Players(previousState.team1Players);
      setTeam1PlayersShuttleDisplay(previousState.team1PlayersShuttleDisplay);
      setTeam1PlayersBackgroundColorClass(previousState.team1PlayersBackgroundColorClass);
      setTeam2Players(previousState.team2Players);
      setTeam2PlayersShuttleDisplay(previousState.team2PlayersShuttleDisplay);
      setTeam2PlayersBackgroundColorClass(previousState.team2PlayersBackgroundColorClass);
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
      setGameWon(initialState.gameWon);
      setGameScore(initialState.gameScore);
      setServerTeamId(initialState.serverTeamId);
      setReceiverTeamId(initialState.receiverTeamId);
      setServerOrReceiverPlayerId(initialState.serverOrReceiverPlayerId);
      setTeam1Players(initialState.team1Players);
      setTeam1PlayersShuttleDisplay(initialState.team1PlayersShuttleDisplay);
      setTeam1PlayersBackgroundColorClass(initialState.team1PlayersBackgroundColorClass);
      setTeam2Players(initialState.team2Players);
      setTeam2PlayersShuttleDisplay(initialState.team2PlayersShuttleDisplay);
      setTeam2PlayersBackgroundColorClass(initialState.team2PlayersBackgroundColorClass);
      setPreviousState(Object.assign({}, initialState));
    }
  };

  return (
    <div className="match_score">
      <div className="court_side_1">
        <Player teamId={1} playerId={1} playerName={team1Players[0]}
          displayShuttle={team1PlayersShuttleDisplay[0]}
          backgroundColorClass={team1PlayersBackgroundColorClass[0]}
          onClick={() => addPointToTeam(1)} />
        <Player teamId={2} playerId={2} playerName={team2Players[1]}
          backgroundColorClass={team2PlayersBackgroundColorClass[1]}
          displayShuttle={team2PlayersShuttleDisplay[1]}
          onClick={() => addPointToTeam(2)} />
      </div>
      <div className="score_box">
        <div id="team1_won_game"><GameWonByTeam teamId={1} listOfGameWon={team1WonGames} /></div>
        <div id="team1_score">{gameScore[0]}</div>
        <div className="undo" onClick={undoScore}>
          <img src={undoImage} alt="Goes back to immediate previous state of the game."
            title="Goes back to immediate previous state of the game." />
        </div>
        <div id="game_time">{getCurrentGameTime(timeElapsedSeconds)}</div>
        <div className="reset" onClick={resetGame}>
          <img src={resetImage} alt="Resets the game. This will add a new set to the match."
            title="Resets the game. This will add a new set to the match." />
        </div>
        <div id="team2_score">{gameScore[1]}</div>
        <div id="team2_won_game"><GameWonByTeam teamId={2} listOfGameWon={team2WonGames} /></div>
      </div>
      <div className="court_side_2">
        <Player teamId={1} playerId={2} playerName={team1Players[1]}
          displayShuttle={team1PlayersShuttleDisplay[1]}
          backgroundColorClass={team1PlayersBackgroundColorClass[1]}
          onClick={() => addPointToTeam(1)} />
        <Player teamId={2} playerId={1} playerName={team2Players[0]}
          displayShuttle={team2PlayersShuttleDisplay[0]}
          backgroundColorClass={team2PlayersBackgroundColorClass[0]}
          onClick={() => addPointToTeam(2)} />
      </div>
    </div>
  );
}

export default Match;
