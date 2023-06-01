import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { collection, addDoc, GeoPoint } from "firebase/firestore";
import "../styles/MarkerForm.css";

const MarkerForm = ({ open, handleClose, db, onMarkerAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.log("Geolocation not supported in this browser.");
    }
  }, []);

  const onSubmit = async () => {
    try {
      const [latitude, longitude] = coordinates
        .split(",")
        .map((coordinate) => parseFloat(coordinate));
      const geoPoint = new GeoPoint(latitude, longitude);
      const docRef = await addDoc(collection(db, "markers"), {
        title,
        description,
        coordinates: geoPoint,
        image,
      });
      console.log("Document written with ID: ", docRef.id);
      onMarkerAdded(); // Call the callback function after successful marker addition
      handleClose();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="dialog-container">
      <DialogTitle className="dialog-title">Neuer Marker</DialogTitle>
      <DialogContent className="dialog-content">
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="textfield"
        />
        <TextField
          margin="dense"
          label="Beschreibung"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textfield"
        />
        <TextField
          margin="dense"
          label="Koordinaten"
          type="text"
          fullWidth
          value={coordinates}
          onChange={(e) => setCoordinates(e.target.value)}
          className="textfield"
        />
        <TextField
          margin="dense"
          label="Bild URL"
          type="text"
          fullWidth
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="textfield"
        />
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={handleClose} className="button">
          Abbrechen
        </Button>
        <Button onClick={onSubmit} className="button">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkerForm;
