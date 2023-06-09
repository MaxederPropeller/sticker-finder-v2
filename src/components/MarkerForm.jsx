import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { collection, addDoc, GeoPoint, Timestamp } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import PageOne from "./PageOne";
import PageTwo from "./PageTwo";

import PageFour from "./PageFour";
import "../styles/MarkerForm.css";
import { styles } from "../styles/styles.js";
import { useMarkers } from "./MarkerContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MarkerForm = ({ open, handleClose, db, onMarkerAdded }) => {
  const { addMarker } = useMarkers();
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Function to handle step change
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Load coordinates when the dialog is opened
  useEffect(() => {
    if (open) {
      fetchCoordinates();
    }
  }, [open]);

  const fetchCoordinates = async () => {
    if (navigator.geolocation) {
      // Check permission status
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });
      if (permissionStatus.state === "denied") {
        console.error("Permission to access geolocation was denied");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error("Error getting location: ", error);
        },
        { enableHighAccuracy: true } // This option can help get more accurate GPS data on mobile devices
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleUploadImage = async (e) => {
    setUploading(true);
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `kapkan/${file.name}`);

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
        timestamp: Timestamp.now(),
      });
      console.log("Document written with ID: ", docRef.id);
      onMarkerAdded();

      // Zustände zurücksetzen
      setTitle("");
      setDescription("");
      setCoordinates("");
      setImage("");

      handleClose();

      // Zurücksetzen des Schrittes
      addMarker();
      setActiveStep(0);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const pages = [
    <PageOne
      coordinates={coordinates}
      setCoordinates={setCoordinates}
      title={title}
      setTitle={setTitle}
      onContinue={handleNext}
      description={description}
      setDescription={setDescription}
    />,

    <PageTwo
      image={image}
      uploading={uploading}
      onImageUpload={handleUploadImage}
      onContinue={handleNext}
      onBack={handleBack}
    />,

    <PageFour
      title={title}
      description={description}
      coordinates={coordinates}
      image={image}
      onSubmit={onSubmit}
      onBack={handleBack}
    />,
  ];

  return (
    <Dialog
      className="dialog"
      style={styles.dialog}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <DialogTitle style={styles.dialogTitle}>
        Neuen Sticker gefunden
      </DialogTitle>
      {pages[activeStep]}
    </Dialog>
  );
};

export default MarkerForm;
