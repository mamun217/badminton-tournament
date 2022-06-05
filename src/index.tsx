import React from 'react';
import ReactDOM from 'react-dom/client';
import ConfigureMatch from './components/ConfigureMatch';
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as Element);
root.render(<ConfigureMatch rootElement={root} />);
