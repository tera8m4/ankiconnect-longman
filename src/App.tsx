import "./App.css"
import AnkiSettings from "./features/ankiConnect/AnkiSettings"
import { AnkiConnectionIndicator } from "./features/ankiConnect/AnkiConnectionIndicator"
import AnkiSettingsDialog from "./features/ankiConnect/AnkiSettingsDialog"
import { Box } from "@mui/material"

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <AnkiConnectionIndicator />
          <AnkiSettingsDialog />
        </Box>
      </header>
    </div>
  )
}

export default App
