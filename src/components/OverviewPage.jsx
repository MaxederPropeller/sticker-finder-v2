import React from "react";
import { Dialog, IconButton } from "@mui/material";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  StyledDialogTitleEnd,
  StyledDialogContent,
  StyledDialogActions,
  StyledButton,
  StyledIconButton,
} from "../styles/MarkerForm";
import CloseIcon from "@mui/icons-material/Close";

const OverviewPage = ({ next, back, data, submit, onClose }) => {
  return (
    <Dialog
      open={true}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          onClose();
          // Hier können Sie zusätzliche Logik hinzufügen, wenn der Dialog durch Escape oder ClickAway geschlossen wird
        }
      }}
      maxWidth="sm"
      fullWidth
    >
      <StyledDialogTitleEnd data={data}>
        Deine Kontrolle vor dem Abschicken!
        <IconButton
          color="inherit"
          aria-label="close"
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitleEnd>
      <StyledDialogContent>
        {data.image && (
          <img
            src={data.image}
            alt="Uploaded"
            style={{ maxWidth: "100%", height: "auto", marginTop: "20px" }}
          />
        )}

        <p>
          Koordinaten:{" "}
          {data && data.coordinates
            ? `${data.coordinates.lat}, ${data.coordinates.lng}`
            : "No coordinates available"}
        </p>

        <p>Ort: {data.address}</p>
        <p>Deine Beschreibung: {data.description}</p>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="contained" onClick={back}>
          Zurück
        </StyledButton>
        <StyledButton variant="contained" color="primary" onClick={submit}>
          Abschicken
        </StyledButton>
      </StyledDialogActions>
    </Dialog>
  );
};

export default OverviewPage;
