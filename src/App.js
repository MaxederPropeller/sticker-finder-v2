import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Map from "./components/Map";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";

import "./index.css";

import { MarkerProvider } from "./components/MarkerContext";

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setDialogOpen(true);
    }
  }, []);

  const handleCheck = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      localStorage.setItem("hasVisited", "true");
      setDialogOpen(false);
    }
  };

  return (
    <MarkerProvider>
      <div className="App">
        <Header />
        <Map />

        <Dialog open={dialogOpen} onClose={handleCheck}>
          <DialogTitle>Herzlich Willkommen bei StickerFinder.ch!</DialogTitle>
          <DialogContent sx={{ overflow: "auto" }}>
            <DialogContentText>
              Schon einmal durch die Strassen geschlendert und einen coolen
              KAPKAN! Aufkleber entdeckt? Bei StickerFinder.ch dreht sich alles
              genau darum! <br />
              <br />
              Unsere Mission ist es, eine interaktive Karte mit den Standorten
              aller KAPKAN! Aufkleber zu erstellen. Wie ein Schatzjäger kannst
              Du durch Deine Stadt streifen und nach diesen verborgenen Juwelen
              Ausschau halten. Sobald Du einen gefunden hast, zück einfach Dein
              Handy, knips ein Foto, tracke den Standort, füge eine kurze
              Beschreibung hinzu und voilà - Du bist Teil unserer
              Stickerfinder-Community!
              <br />
              <br />
              Alle Aufkleber, die in den letzten 24 Stunden entdeckt wurden,
              werden auf der Karte farblich hervorgehoben. So wird die Karte von
              Tag zu Tag bunter und füllt sich mit den Stickerfunden unserer
              Nutzer.
              <br />
              <br />
              Teile Deine besten Fundstücke mit uns und der Welt auf Instagram
              unter @kapkan.ch. Mach mit und hilf uns, diese interaktive
              Kunstausstellung zum Leben zu erwecken. Es wartet eine ganze Welt
              voller Sticker darauf, von Dir entdeckt zu werden!
              <br />
              <br />
            </DialogContentText>
            <Button variant="contained" color="primary" onClick={handleCheck}>
              {isChecked ? "Diese Nachricht nicht mehr anzeigen" : "Verstanden"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </MarkerProvider>
  );
}

export default App;
