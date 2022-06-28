import React, { MouseEvent } from "react";
import ReactDOM from "react-dom/client";
import ConfigureMatch from "./components/ConfigureMatch";
import ConfigureTournament from "./components/ConfigureTournament";
import "./main.scss";
import reportWebVitals from "./reportWebVitals";

const ROUTE_ID_SINGLE_MATCH = "sm";
const ROUTE_ID_TOURNAMENT = "tm";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const Router = () => {
  const route = (routeId: string, event: MouseEvent<HTMLButtonElement>) => {
    if (routeId === ROUTE_ID_SINGLE_MATCH) {
      root.render(
        <React.StrictMode>
          <ConfigureMatch />
        </React.StrictMode>
      );
    } else if (routeId === ROUTE_ID_TOURNAMENT) {
      root.render(
        <React.StrictMode>
          <ConfigureTournament />
        </React.StrictMode>
      );
    }
  };

  return (
    <div className="router-container">
      <button onClick={(event) => route(ROUTE_ID_SINGLE_MATCH, event)}>
        Single Match
      </button>
      <button onClick={(event) => route(ROUTE_ID_TOURNAMENT, event)}>
        Tournament
      </button>
    </div>
  );
};

root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);

reportWebVitals();
