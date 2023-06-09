import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styles } from "../styles/styles";
import opencage from "opencage-api-client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Grid from "@mui/material/Grid";
const MAX_SIZE_MB = 1;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // 1MB in bytes

const PageOne = ({
  coordinates,
  setCoordinates,
  title,
  setTitle,
  description,
  setDescription,
  onContinue,
  onBack,
}) => {
  const [location, setLocation] = useState("");

  const checkSize = (str) => {
    const sizeInBytes = new Blob([str]).size;
    return sizeInBytes <= MAX_SIZE_BYTES;
  };

  const handleInputChange = (setter) => (event) => {
    const value = event.target.value;
    if (checkSize(value)) {
      setter(value);
    } else {
      alert("Eingabe überschreitet das Limit von 1MB");
    }
  };

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
            setTitle(place.formatted);
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
      {location && (
        <div className="locationBox">Hier bist du! - {location}</div>
      )}
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12}>
          <TextField
            className="TextField"
            margin="dense"
            label="Koordinaten"
            type="text"
            fullWidth
            value={coordinates}
            onChange={handleInputChange(setCoordinates)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            multiline
            value={title}
            onChange={handleInputChange(setTitle)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="dense"
            label="Beschreibung, Links, Hashtags, ..."
            type="text"
            fullWidth
            multiline
            value={description}
            onChange={handleInputChange(setDescription)}
          />
        </Grid>
      </Grid>
      <div>
        <Button style={styles.button} onClick={onBack}>
          <ArrowBackIcon />
        </Button>
        <Button style={styles.button} onClick={onContinue}>
          <ArrowForwardIcon />
        </Button>
      </div>
    </div>
  );
};

export default PageOne;
