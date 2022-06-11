import { FormEvent, useState } from "react";
import './ConfigureTournament.css';

// Dummy data for simulation and finalizing idea.
const standingHeaders = [
  'Team', 'Match Played', 'Match Point', 'Set Played', 'Earned Score', 'Lost Score', 'APD',
];
const standingGroupA = [
  { team: 'Tarchera-1', matchPlayed: 3, matchPoint: 4, setPlayed: 8, earnedScore: 104, lostScore: 89 },
  { team: 'Mars', matchPlayed: 3, matchPoint: 4, setPlayed: 7, earnedScore: 92, lostScore: 81 },
  { team: 'Legend-4', matchPlayed: 3, matchPoint: 4, setPlayed: 8, earnedScore: 97, lostScore: 96 },
  { team: 'Legend-2', matchPlayed: 3, matchPoint: 0, setPlayed: 7, earnedScore: 73, lostScore: 100 },
];
const standingGroupB = [
  { team: 'Tarchera-0', matchPlayed: 3, matchPoint: 6, setPlayed: 7, earnedScore: 104, lostScore: 80 },
  { team: 'Ogose Wolves', matchPlayed: 3, matchPoint: 4, setPlayed: 7, earnedScore: 94, lostScore: 78 },
  { team: 'Tarchera-4', matchPlayed: 3, matchPoint: 2, setPlayed: 7, earnedScore: 82, lostScore: 101 },
  { team: 'Hotshots', matchPlayed: 3, matchPoint: 0, setPlayed: 7, earnedScore: 81, lostScore: 102 },
];
const groupAMatches = [
  { team1: 'Legend-2', team2: 'Mars', winner: 'team2' },
  { team1: 'Legend-2', team2: 'Legend-4', winner: 'team2' },
  { team1: 'Legend-2', team2: 'Tarchera-1', winner: 'team2' },
  { team1: 'Mars', team2: 'Legend-4', winner: 'team1' },
  { team1: 'Mars', team2: 'Tarchera-1', winner: 'team2' },
  { team1: 'Legend-4', team2: 'Tarchera-1', winner: 'team1' },
];
const groupBMatches = [
  { team1: 'Tarchera-0', team2: 'Tarchera-4', winner: 'team1' },
  { team1: 'Tarchera-0', team2: 'Hotshots', winner: 'team1' },
  { team1: 'Tarchera-0', team2: 'Ogose Wolves', winner: 'team1' },
  { team1: 'Tarchera-4', team2: 'Hotshots', winner: 'team1' },
  { team1: 'Tarchera-4', team2: 'Ogose Wolves', winner: 'team2' },
  { team1: 'Hotshots', team2: 'Ogose Wolves', winner: 'team2' },
];

const TournamentFixture = () => {

  const getAPD = (earnedScore: number, lostScore: number, setPlayed: number) => {
    return ((earnedScore - lostScore) / setPlayed).toFixed(2);
  };

  return (
    <div>
      <section className="header">Group Stage</section>
      <section className="standing">
        <div className="group">
          <div className="group-header">Group A</div>
          <div className="group-data">
            <div className="group-data-header">
              {
                standingHeaders.map((h) => {
                  return (<div>{h}</div>);
                })
              }
            </div>
            {
              standingGroupA.map((team) => {
                return (
                  <div className="group-data-content">
                    <div>{team.team}</div>
                    <div>{team.matchPlayed}</div>
                    <div>{team.matchPoint}</div>
                    <div>{team.setPlayed}</div>
                    <div>{team.earnedScore}</div>
                    <div>{team.lostScore}</div>
                    <div>{getAPD(team.earnedScore, team.lostScore, team.setPlayed)}</div>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="group">
          <div className="group-header">Group B</div>
          <div className="group-data">
            <div className="group-data-header">
              {
                standingHeaders.map((h) => {
                  return (<div>{h}</div>);
                })
              }
            </div>
            {
              standingGroupB.map((team) => {
                return (
                  <div className="group-data-content">
                    <div>{team.team}</div>
                    <div>{team.matchPlayed}</div>
                    <div>{team.matchPoint}</div>
                    <div>{team.setPlayed}</div>
                    <div>{team.earnedScore}</div>
                    <div>{team.lostScore}</div>
                    <div>{getAPD(team.earnedScore, team.lostScore, team.setPlayed)}</div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </section>
      <section className="plain-match">
        <div className="group">
          <div className="group-header">Group A</div>
          <div className="round">
            {
              groupAMatches.map((match) => {
                return (
                  <ul className="matchup">
                    <li className={`team team-top ${match.winner === 'team1' && 'winner'}`}>{match.team1}</li>
                    <li className={`team team-bottom ${match.winner === 'team2' && 'winner'}`}>{match.team2}</li>
                  </ul>
                );
              })
            }
          </div>
        </div>
        <div className="group">
          <div className="group-header">Group B</div>
          <div className="round">
            {
              groupBMatches.map((match) => {
                return (
                  <ul className="matchup">
                    <li className={`team team-top ${match.winner === 'team1' && 'winner'}`}>{match.team1}</li>
                    <li className={`team team-bottom ${match.winner === 'team2' && 'winner'}`}>{match.team2}</li>
                  </ul>
                );
              })
            }
          </div>
        </div>
      </section >
      <section className="header">Knockout</section>
      <section className="bracket">
        <div className="knockout">
          <div className="round round-one">
            <ul className="matchup">
              <li className="team team-top winner">Bits and Bytes</li>
              <li className="team team-bottom">Rockette Riders</li>
            </ul>
            <ul className="matchup">
              <li className="team team-top">Bits and Bytes</li>
              <li className="team team-bottom winner">Rockette Riders</li>
            </ul>
            <ul className="matchup">
              <li className="team team-top winner">Bits and Bytes</li>
              <li className="team team-bottom">Rockette Riders</li>
            </ul>
            <ul className="matchup">
              <li className="team team-top">Bits and Bytes</li>
              <li className="team team-bottom winner">Rockette Riders</li>
            </ul>
          </div>

          <div className="round round-two">
            <ul className="matchup">
              <li className="team team-top ">Bits and Bytes</li>
              <li className="team team-bottom">Rockette Riders</li>
            </ul>
            <ul className="matchup">
              <li className="team team-top ">Bits and Bytes</li>
              <li className="team team-bottom">Rockette Riders</li>
            </ul>
          </div>

          <div className="round round-three">
            <ul className="matchup">
              <li className="team team-top "></li>
              <li className="team team-bottom"></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

const ConfigureTournament = () => {

  const [totalTeam, setTotalTeam] = useState(2);

  const createFixture = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (totalTeam % 2 !== 0) {
      return alert('Requires even number of teams');
    }
  };

  return (
    // <div>
    //   <form onSubmit={createFixture}>
    //     <div>
    //       <label htmlFor="totalTeam">Total Teams </label>
    //       <input name="totalTeam" id="totalTeam" type="number" required min={2} max={48} size={3} value={totalTeam}
    //         onChange={(event) => setTotalTeam(parseInt(event.target.value))} />
    //     </div>
    //     <div className="buttons">
    //       <button type="reset">Reset</button>
    //       <button type="submit">Go To Fixture</button>
    //     </div>
    //   </form>
    // </div>
    <TournamentFixture />
  );
};

export default ConfigureTournament;
