import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import opencage from "opencage-api-client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styles } from "../styles/styles";

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
  const [open, setOpen] = useState(false);
  const [canOverride, setCanOverride] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const checkSize = (str) => {
    const sizeInBytes = new Blob([str]).size;
    return sizeInBytes <= MAX_SIZE_BYTES;
  };

  const askForOverridePermission = () => {
    setOpenConfirm(true);
  };

  const handleConfirmOverride = () => {
    setOpenConfirm(false);
    setCanOverride(true);
  };

  const handleInputChange =
    (setter, requiresPermission = false) =>
    (event) => {
      const value = event.target.value;
      if (checkSize(value)) {
        if (!requiresPermission || (requiresPermission && canOverride)) {
          setter(value);
        } else {
          askForOverridePermission();
        }
      } else {
        setOpen(true);
      }
    };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
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

  const handleOnContinue = () => {
    if (!coordinates || !title || !description) {
      setOpen(true);
    } else {
      onContinue();
    }
  };

  return (
    <div className="dialogContainer">
      <Snackbar
        anchorOrigin={{ vertical: "Top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MuiAlert
          onClose={handleClose}
          severity="error"
          elevation={6}
          variant="filled"
        >
          Bitte füllen Sie alle Felder korrekt aus.
        </MuiAlert>
      </Snackbar>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Geodaten überschreiben?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sind Sie sicher, dass Sie die Geodaten und den Ortsnamen
            überschreiben möchten?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Abbrechen</Button>
          <Button onClick={handleConfirmOverride}>Überschreiben</Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2} sx={{ marginTop: 1, marginBottom: 1 }}>
        <Grid item xs={12}>
          <TextField
            className="TextField"
            margin="dense"
            label="Aktuelle Koordinaten"
            type="text"
            fullWidth
            value={coordinates}
            onChange={handleInputChange(setCoordinates, true)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="dense"
            label="Aktueller Straßenname"
            type="text"
            fullWidth
            multiline
            value={title}
            onChange={handleInputChange(setTitle, true)}
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
        <Button style={styles.button} variant="outlined" onClick={onBack}>
          <ArrowBackIcon />
        </Button>
        <Button
          style={styles.button}
          variant="outlined"
          onClick={handleOnContinue}
        >
          <ArrowForwardIcon />
        </Button>
      </div>
    </div>
  );
};

export default PageOne;
