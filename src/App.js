import React, { useState } from "react";
import Header from "./components/Header";
import Map from "./components/Map";
import MarkerForm from "../src/components/MarkerForm";

function App() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = (data) => {
    // Hier können Sie den neuen Marker speichern
  };

  return (
    <div className="App">
      <Header />
      <Map />
      <MarkerForm
        open={open}
        handleClose={handleClose}
        handleSave={handleSave}
      />
      {/* Hier können Sie den Button zum Hinzufügen eines neuen Markers hinzufügen */}
    </div>
  );
}

export default App;
