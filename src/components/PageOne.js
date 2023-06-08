import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styles } from "../styles/styles";
import opencage from "opencage-api-client";

const PageOne = ({
  coordinates,
  setCoordinates,
  title,
  setTitle,
  onContinue,
}) => {
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (coordinates) {
      opencage
        .geocode({
          q: coordinates,
          key: process.env.REACT_APP_OPENCAGE_API_KEY,
        })
        .then((data) => {
          if (data.results.length > 0) {
            const place = data.results[0];
            setLocation(place.formatted);
            setTitle(place.formatted); // Diese Zeile aktualisiert jetzt den `title`-Zustand in `MarkerForm`
          } else {
            setLocation("Kein Ort gefunden");
          }
        })
        .catch((error) => {
          console.error(error);
          setLocation("Fehler bei der Standortbestimmung");
        });
    }
  }, [coordinates, setTitle]);

  return (
    <div className="dialogContainer">
      {location && <div className="locationBox">{location}</div>}
      <TextField
        className="TextField"
        margin="dense"
        label="Koordinaten"
        type="text"
        fullWidth
        value={coordinates}
        onChange={(e) => setCoordinates(e.target.value)}
      />

      <Button style={styles.button} onClick={onContinue}>
        Weiter
      </Button>
    </div>
  );
};

export default PageOne;
