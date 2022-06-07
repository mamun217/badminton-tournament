import React from 'react';
import ReactDOM from 'react-dom/client';
import ConfigureMatch from './components/ConfigureMatch';
import "./index.css";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <ConfigureMatch rootElement={root} />
  </React.StrictMode>
);

reportWebVitals();
