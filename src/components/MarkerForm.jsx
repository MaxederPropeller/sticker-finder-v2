import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { collection, addDoc, GeoPoint } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import "../styles/MarkerForm.css";

const MarkerForm = ({ open, handleClose, db, onMarkerAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const handleUploadImage = async (e) => {
    setUploading(true);
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name}`);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      const snapshot = await uploadString(storageRef, base64String, "data_url");
      const url = await getDownloadURL(snapshot.ref);
      setImage(url);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async () => {
    if (uploading) {
      alert("Bitte warten Sie, bis das Bild fertig hochgeladen ist.");
      return;
    }

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
      <DialogTitle className="dialog-title">
        Neuen Sticker gefunden?
      </DialogTitle>
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
          type="file"
          fullWidth
          onChange={handleUploadImage}
          className="textfield"
        />
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={handleClose} className="button">
          Abbrechen
        </Button>
        <Button onClick={onSubmit} disabled={uploading} className="button">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkerForm;
