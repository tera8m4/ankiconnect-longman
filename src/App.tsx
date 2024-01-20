import "./App.css"
import { AnkiConnectionIndicator } from "./features/ankiConnect/AnkiConnectionIndicator"
import AnkiSettingsDialog from "./features/ankiConnect/AnkiSettingsDialog"
import { Box } from "@mui/material"
import SearchBar from "./features/dictionary/SearchBar"
import VocabularyCard from "./features/dictionary/VocabularyCard"
import { Dictionary } from "./features/dictionary/Dictionary"
import { useState } from "react"

const App = () => {
  const [word, setWord] = useState('');
  return (
    <div className="App">
      <header className="App-header">
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <AnkiConnectionIndicator />
          <AnkiSettingsDialog />
        </Box>
        <SearchBar onSubmit={x => setWord(x)} />
        <Dictionary word={word} />
      </header>
    </div>
  )
}

export default App
