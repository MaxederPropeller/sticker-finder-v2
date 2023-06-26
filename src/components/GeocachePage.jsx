import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, TextField, Button, IconButton } from "@mui/material";
import opencage from "opencage-api-client";
import { styled } from "@mui/system";
import { DialogTitle } from "@mui/material";
import { GeoPoint } from "firebase/firestore";
import CloseIcon from "@mui/icons-material/Close";

import {
  StyledDialogContent,
  StyledDialogActions,
  StyledButton,
} from "../styles/MarkerForm";

const StyledDialogTitle = styled(DialogTitle)(({ theme, allFieldsFilled }) => ({
  textAlign: "center",
  color: "#fff",
  backgroundColor: allFieldsFilled ? "#4caf50" : "#f44336", // green or red
}));

const GeocachePage = ({ next, back, setData, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    getValues,
  } = useForm();

  const [coordinates, setCoordinates] = useState({ lat: null, lng: null }); // Update initial state to use null instead of empty string
  const [addressDetails, setAddressDetails] = useState("");
  const [allGeoInfoAvailable, setAllGeoInfoAvailable] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  const fetchGeolocationFromBrowser = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setAddressFromCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        // Error callback
        () => {}
      );
    } else {
    }
  }, []);

  useEffect(() => {
    fetchGeolocationFromBrowser();
    const isAllFieldsFilled =
      allGeoInfoAvailable &&
      getValues("description") !== "" &&
      coordinates.lat !== null &&
      coordinates.lng !== null &&
      addressDetails !== "";

    setAllFieldsFilled(isAllFieldsFilled);

    console.log("Are all fields filled:", isAllFieldsFilled); // Debug message
  }, [
    allGeoInfoAvailable,
    getValues,
    fetchGeolocationFromBrowser,
    coordinates,
    addressDetails,
  ]);

  const setAddressFromCoordinates = (lat, lng) => {
    opencage
      .geocode({
        q: `${lat}+${lng}`,
        key: process.env.REACT_APP_OPENCAGE_API_KEY,
      })
      .then((response) => {
        if (response.results.length > 0) {
          let result = response.results[0];
          setAddressDetails(result.formatted);
          setAllGeoInfoAvailable(true);
        } else {
        }
      })
      .catch((error) => {});
  };

  const onSubmit = (data) => {
    const { lat, lng } = coordinates;

    next({
      coordinates: { lat, lng },
      description: data.description,
      address: addressDetails,
    });
  };

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledDialogTitle allFieldsFilled={allFieldsFilled}>
          {allFieldsFilled
            ? "Ready to go!"
            : "Standort abfragen und Beschreibung hinzufügen"}
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
        </StyledDialogTitle>
        <StyledDialogContent>
          <TextField
            label="Koordinaten"
            value={`${coordinates.lat}, ${coordinates.lng}`}
            disabled
            style={{ marginBottom: "10px", marginTop: "10px" }}
          />
          <TextField
            label="Adresse"
            value={addressDetails}
            multiline
            disabled={addressDetails.startsWith("Unglaubliche Strasse")}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          />
          <TextField
            {...register("description", { required: true })}
            label="Beschreibung"
            multiline
            error={errors.description ? true : false}
            helperText={errors.description && "Beschreibung ist erforderlich."}
            color={errors.description ? "secondary" : "primary"}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          />
        </StyledDialogContent>
        <StyledDialogActions>
          <StyledButton variant="contained" onClick={back}>
            Zurück
          </StyledButton>
          <StyledButton
            variant="contained"
            color={allFieldsFilled ? "success" : "primary"}
            type="submit"
            disabled={!allFieldsFilled}
          >
            Weiter
          </StyledButton>
        </StyledDialogActions>
      </form>
    </Dialog>
  );
};

export default GeocachePage;
