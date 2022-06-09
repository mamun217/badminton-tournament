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

interface IGameWonByTeam {
  teamId: number;
  listOfGameWon: GameUtils.WonGameInfo[];
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

const padTime = (timeValue: number) => {
  return String(timeValue).padStart(2, "0");
};

const getCurrentGameTime = (argTimeElapsedSeconds: number) => {
  const minute = Math.floor(argTimeElapsedSeconds / 60);
  const second = Math.floor(argTimeElapsedSeconds % 60);
  return (padTime(minute) + ":" + padTime(second));
};

const PlayerShuttle = (props: IPlayerShuttle) => {
  return (
    (props.displayShuttle) ?
      (<p id={props.elementId}><img src={shuttleImage} alt="Server's shuttle" /></p>) : <></>
  );
};

const GameWonByTeam = (props: IGameWonByTeam) => {
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
};

const Player = (props: IPlayer) => {
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
};

const useGameState = (argTeam1Players: string[], argTeam2Players: string[], argNoDeuce: boolean, argScoreToWin: number) => {
  const initialState = {
    matchWon: false,
    gameInProgress: 1,
    gameScore: [0, 0],
    gameWon: [false, false],
    gamesWonByTeam1: [] as GameUtils.WonGameInfo[],
    gamesWonByTeam2: [] as GameUtils.WonGameInfo[],
    serverTeamId: 1 as GameUtils.TeamOrPlayerId,
    serverAndReceiverPlayerId: 1 as GameUtils.TeamOrPlayerId,
    team1Players: argTeam1Players,
    team1PlayersShuttleDisplay: [true, false],
    team1PlayersBackgroundColorClass: [GameUtils.SERVER_RECEIVER_BACKGROUND_CSS_CLASS, ''],
    team2Players: argTeam2Players,
    team2PlayersShuttleDisplay: [false, false],
    team2PlayersBackgroundColorClass: [GameUtils.SERVER_RECEIVER_BACKGROUND_CSS_CLASS, ''],
  };

  const [matchWon, setMatchWon] = useState(initialState.matchWon);
  const [timeElapsedSeconds, setTimeElapsedSeconds] = useState(0);
  const [gameInProgress, setGameInProgress] = useState(initialState.gameInProgress);
  const [gameScore, setGameScore] = useState(initialState.gameScore);
  const [gameWon, setGameWon] = useState(initialState.gameWon);
  const [gamesWonByTeam1, setGamesWonByTeam1] = useState(initialState.gamesWonByTeam1);
  const [gamesWonByTeam2, setGamesWonByTeam2] = useState(initialState.gamesWonByTeam2);
  const [serverTeamId, setServerTeamId] = useState(initialState.serverTeamId);
  const [serverAndReceiverPlayerId, setServerAndReceiverPlayerId] = useState(initialState.serverAndReceiverPlayerId);
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
      gamesWonByTeam1,
      gamesWonByTeam2,
      team1Players,
      team1PlayersShuttleDisplay,
      team1PlayersBackgroundColorClass,
      team2Players,
      team2PlayersShuttleDisplay,
      team2PlayersBackgroundColorClass,
      serverTeamId,
      serverAndReceiverPlayerId,
    });
  };

  const undoScore = () => {
    if (window.confirm("Wish to go back to previous state of the game?")) {
      setMatchWon(previousState.matchWon);
      setGameInProgress(previousState.gameInProgress);
      setGameScore(previousState.gameScore);
      setGameWon(previousState.gameWon);
      setGamesWonByTeam1(previousState.gamesWonByTeam1);
      setGamesWonByTeam2(previousState.gamesWonByTeam2);
      setTeam1Players(previousState.team1Players);
      setTeam1PlayersShuttleDisplay(previousState.team1PlayersShuttleDisplay);
      setTeam1PlayersBackgroundColorClass(previousState.team1PlayersBackgroundColorClass);
      setTeam2Players(previousState.team2Players);
      setTeam2PlayersShuttleDisplay(previousState.team2PlayersShuttleDisplay);
      setTeam2PlayersBackgroundColorClass(previousState.team2PlayersBackgroundColorClass);
      setServerTeamId(previousState.serverTeamId);
      setServerAndReceiverPlayerId(previousState.serverAndReceiverPlayerId);
    }
  };

  const resetGame = () => {
    if (matchWon) {
      alert("This match has a result already. Probably a good time to have some rest!");
      return;
    }

    if (window.confirm("Wish to start a new game?")) {
      setTimeElapsedSeconds(0);
      setGameWon(initialState.gameWon);
      setGameScore(initialState.gameScore);
      setServerTeamId(initialState.serverTeamId);
      setServerAndReceiverPlayerId(initialState.serverAndReceiverPlayerId);
      setTeam1Players(initialState.team1Players);
      setTeam1PlayersShuttleDisplay(initialState.team1PlayersShuttleDisplay);
      setTeam1PlayersBackgroundColorClass(initialState.team1PlayersBackgroundColorClass);
      setTeam2Players(initialState.team2Players);
      setTeam2PlayersShuttleDisplay(initialState.team2PlayersShuttleDisplay);
      setTeam2PlayersBackgroundColorClass(initialState.team2PlayersBackgroundColorClass);
      setPreviousState(Object.assign({}, initialState));
    }
  };

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
  const handlePlayersSide = (teamId: GameUtils.TeamOrPlayerId) => {
    if (serverTeamId !== teamId) {
      return;
    }

    (teamId === 1) ? setTeam1Players([team1Players[1], team1Players[0]]) : setTeam2Players([team2Players[1], team2Players[0]]);
  };

  const changeServerAndReceiver = (idOfTeamEarnedThePoint: GameUtils.TeamOrPlayerId) => {
    const nextServerAndReceiver = GameUtils.determineNextServerAndReceiver(idOfTeamEarnedThePoint,
      serverTeamId, serverAndReceiverPlayerId, gameScore[0], gameScore[1]);
    if (serverTeamId !== idOfTeamEarnedThePoint) {
      setServerTeamId(nextServerAndReceiver.serverTeamId);
    }

    setServerAndReceiverPlayerId(nextServerAndReceiver.serverAndReceiverPlayerId);
    setServerReceiverBackgroundColor(nextServerAndReceiver.serverAndReceiverPlayerId);
    setServerShuttle(nextServerAndReceiver.serverTeamId, nextServerAndReceiver.serverAndReceiverPlayerId);
  };

  const processGameResult = (argTeamId: GameUtils.TeamOrPlayerId, argTeam1Score: number, argTeam2Score: number) => {
    // If no one has won the game yet then continue with the play.
    if (argTeamId !== GameUtils.getTeamIdOfGameWinner(argTeam1Score, argTeam2Score, argNoDeuce, argScoreToWin)) {
      return;
    }

    const game: GameUtils.WonGameInfo = {
      gameNumber: gameInProgress,
      teamScore: 0,
      opponentScore: 0,
      gameTime: getCurrentGameTime(timeElapsedSeconds),
    };

    let tempGameWon = Object.assign([] as boolean[], initialState.gameWon);
    tempGameWon[argTeamId - 1] = true;
    setGameWon(tempGameWon);

    let team1WinCount = gamesWonByTeam1.length;
    let team2WinCount = gamesWonByTeam2.length;
    if (argTeamId === 1) {
      team1WinCount++;
      game.teamScore = argTeam1Score;
      game.opponentScore = argTeam2Score;
      setGamesWonByTeam1(prev => [...prev, game]);
    } else {
      team2WinCount++;
      game.teamScore = argTeam2Score;
      game.opponentScore = argTeam1Score;
      setGamesWonByTeam2(prev => [...prev, game]);
    }

    const teamPlayers = (argTeamId === 1) ? `${team1Players[0]} & ${team1Players[1]}` : `${team2Players[0]} & ${team2Players[1]}`;

    // Check if the match is also won by the team
    const matchWinnerTeamId = MatchUtils.getTeamIdOfMatchWinner(team1WinCount, team2WinCount);
    if (matchWinnerTeamId !== 0) { // If a team won the match
      setMatchWon(true);
      alert(`${teamPlayers} won the match!`);
      return;
    }

    // Match not won by any team yet. Move on to next game.
    alert(`${teamPlayers} won the game!`);
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
    handlePlayersSide(teamId);

    // Change server and receiver court, color and shuttle display
    changeServerAndReceiver(teamId);

    // Process game and consequently match result if any team won the game based on the current score
    processGameResult(teamId, team1LatestScore, team2LatestScore);
  };

  /*
   * Keeps total time of a game 
   */
  useEffect(() => {
    if (!(gameWon[0] || gameWon[1])) {
      const gameTimer = setInterval(() => {
        setTimeElapsedSeconds(timeElapsedSeconds + 1);
      }, 1000);

      return () => clearInterval(gameTimer);
    }
  }, [timeElapsedSeconds, gameWon]);

  return {
    timeElapsedSeconds, gameScore, gamesWonByTeam1, gamesWonByTeam2,
    team1Players, team1PlayersShuttleDisplay, team1PlayersBackgroundColorClass,
    team2Players, team2PlayersShuttleDisplay, team2PlayersBackgroundColorClass,
    undoScore, resetGame, addPointToTeam,
  }
};

const Match = (props: IMatch) => {
  const {
    timeElapsedSeconds,
    gameScore,
    gamesWonByTeam1,
    gamesWonByTeam2,
    team1Players,
    team1PlayersShuttleDisplay,
    team1PlayersBackgroundColorClass,
    team2Players,
    team2PlayersShuttleDisplay,
    team2PlayersBackgroundColorClass,
    undoScore, resetGame, addPointToTeam,
  } = useGameState(
    [props.servingPlayer1, props.servingPlayer2],
    [props.receivingPlayer1, props.receivingPlayer2],
    props.noDeuce, props.scoreToWin
  );

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
        <div id="team1_won_game"><GameWonByTeam teamId={1} listOfGameWon={gamesWonByTeam1} /></div>
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
        <div id="team2_won_game"><GameWonByTeam teamId={2} listOfGameWon={gamesWonByTeam2} /></div>
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
};

export default Match;
