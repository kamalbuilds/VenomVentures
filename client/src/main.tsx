import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import { createEmotionCache, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

const root = ReactDOM.createRoot(document.getElementById("root") as Element);

const myCache = createEmotionCache({
  key: "mantine",
  prepend: false,
});

// livepeer
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";

const apiKey = process.env.REACT_APP_LIVEPEER_API_KEY || "";
// console.log({ apiKey });
const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey
  }),
});


root.render(
  <LivepeerConfig client={livepeerClient}>
      
      <MantineProvider
        emotionCache={myCache}
        withGlobalStyles
        theme={{
          colorScheme: "dark",
          primaryColor: "blue",
          defaultGradient: {
            from: "blue",
            to: "green",
            deg: 10,
          },
        }}
      >
        
        <NotificationsProvider position="top-right">
          <Router>
              
                <App />
              
          </Router>
        </NotificationsProvider>
        
      </MantineProvider>
  </LivepeerConfig>
);
