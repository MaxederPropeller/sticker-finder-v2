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

import { v4 as uuidv4 } from "uuid";
import EXIF from "exif-js";

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
  const [file, setFile] = useState(null); // Zustand für die hochgeladene Datei hinzufügen

  // Function to handle step change
  const handleNext = () => {
    // Check file type before moving to the next step
    if (activeStep === 0 && file) {
      // Assuming that PageTwo is the first step
      // Prüfen, ob der Dateityp ein gängiger Bildtyp ist
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
      ];
      if (!validImageTypes.includes(file.type)) {
        alert("Bitte lade eine Bilddatei hoch");
        return;
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Load coordinates when the dialog is opened
  useEffect(() => {
    if (open && !coordinates) {
      fetchCoordinates();
    }
  }, [open, coordinates]);

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
    const uploadedFile = e.target.files[0];

    // Überprüfen, ob eine Datei ausgewählt wurde
    if (!uploadedFile) {
      alert(
        "Bitte wählen Sie eine Datei aus, bevor Sie versuchen hochzuladen."
      );
      setUploading(false);
      return;
    }

    setUploading(true);
    setFile(uploadedFile); // Setzen Sie den Dateizustand beim Hochladen
    const file = e.target.files[0];
    const storage = getStorage();

    // Prüfen, ob der Dateityp ein gängiger Bildtyp ist
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      alert("Bitte lade eine Bilddatei hoch");
      setUploading(false);
      return;
    }

    // Generiere einen eindeutigen Dateinamen durch Hinzufügen einer UUID
    const uniqueFileName = `${file.name}-${uuidv4()}`;

    const storageRef = ref(storage, `kapkan/${uniqueFileName}`);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      const snapshot = await uploadString(storageRef, base64String, "data_url");
      const url = await getDownloadURL(snapshot.ref);

      // EXIF-Daten auslesen
      EXIF.getData(file, function () {
        let lat = EXIF.getTag(this, "GPSLatitude");
        let lon = EXIF.getTag(this, "GPSLongitude");

        // GPS Daten von [degrees, minutes, seconds] zu decimal umwandeln
        if (lat && lon) {
          lat = (lat[0] + lat[1] / 60 + lat[2] / 3600).toFixed(6);
          lon = (lon[0] + lon[1] / 60 + lon[2] / 3600).toFixed(6);
        }

        console.log(`EXIF Geodaten: Breitengrad = ${lat}, Längengrad = ${lon}`); // Geodaten in der Konsole ausgeben

        if (lat && lon) {
          setCoordinates(`${lat}, ${lon}`);
        } else {
          fetchCoordinates(); // Wenn keine EXIF-Geodaten vorhanden sind, verwenden Sie die Geolocation-API des Browsers
        }
      });

      setImage(url);
      setUploading(false);
      e.target.value = "";
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
      setImage("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  useEffect(() => {
    if (!open) {
      // Zustände zurücksetzen
      setTitle("");
      setDescription("");
      setCoordinates("");
      setImage("");
      setActiveStep(0);
    }
  }, [open]);

  const pages = [
    <PageTwo
      image={image}
      uploading={uploading}
      onImageUpload={handleUploadImage}
      onContinue={handleNext}
      onBack={handleBack}
    />,
    <PageOne
      coordinates={coordinates}
      setCoordinates={setCoordinates}
      title={title}
      setTitle={setTitle}
      onContinue={handleNext}
      onBack={handleBack}
      description={description}
      setDescription={setDescription}
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
      open={open || false}
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
