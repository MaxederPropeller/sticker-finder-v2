import React from "react";
import { Dialog } from "@mui/material";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  StyledDialogTitleEnd,
  StyledDialogContent,
  StyledDialogActions,
  StyledButton,
  StyledIconButton,
} from "../styles/MarkerForm";

const OverviewPage = ({ next, back, data, submit, closeDialog }) => {
  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <StyledDialogTitleEnd data={data}>Übersicht</StyledDialogTitleEnd>
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
