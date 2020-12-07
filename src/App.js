import React from 'react';
import './App.css';
import { App as SendBirdApp } from 'sendbird-uikit';
import 'sendbird-uikit/dist/index.css';
import { messaging } from "./init-firebase-messaging";

function App() {
  return (
    <div className="App">
      <SendBirdApp
        appId={process.env.APP_ID}
        userId="sendbird"
        nickname="sendbird"
      />
    </div>
  );
}

export default App;



