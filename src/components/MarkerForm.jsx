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
import { v4 as uuidv4 } from "uuid";
import EXIF from "exif-js";
import PageOne from "./PageOne";
import PageTwo from "./PageTwo";
import PageFour from "./PageFour";
import "../styles/MarkerForm.css";
import { styles } from "../styles/styles.js";
import { useMarkers } from "./MarkerContext";
import imageCompression from "browser-image-compression";

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
  const [file, setFile] = useState(null);

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadFile = async (file) => {
    const storage = getStorage();
    const uniqueFileName = `${file.name}-${uuidv4()}`;
    const storageRef = ref(storage, `kapkan/${uniqueFileName}`);
    const base64String = await toBase64(file);
    const snapshot = await uploadString(storageRef, base64String, "data_url");
    const url = await getDownloadURL(snapshot.ref);
    setImage(url);
    setUploading(false);
  };
  const isValidImageFile = (file) => {
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
    ];
    return validImageTypes.includes(file.type);
  };

  const handleNext = () => {
    if (activeStep === 0 && file && !isValidImageFile(file)) {
      alert("Bitte lade eine Bilddatei hoch");
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    if (open && !coordinates) {
      fetchCoordinates();
    }
  }, [open, coordinates]);

  const fetchCoordinates = async () => {
    if (navigator.geolocation) {
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
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleUploadImage = async (e) => {
    const uploadedFile = e.target.files[0];

    if (!uploadedFile) {
      alert(
        "Bitte wählen Sie eine Datei aus, bevor Sie versuchen hochzuladen."
      );
      setUploading(false);
      return;
    }

    setUploading(true);
    setFile(uploadedFile);

    if (!isValidImageFile(uploadedFile)) {
      alert("Bitte lade eine Bilddatei hoch");
      setUploading(false);
      return;
    }

    // Start der Bildkomprimierung
    const options = {
      maxSizeMB: 2, // (max file size in MB)
      maxWidthOrHeight: 1920, // this option will reduce the dimension of the image while keeping the aspect ratio
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(uploadedFile, options);
      // Fortsetzung des Hochladens mit der komprimierten Datei
      uploadFile(compressedFile);
    } catch (error) {
      console.error("Error occurred during image compression:", error);
    }
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

      setTitle("");
      setDescription("");
      setCoordinates("");
      setImage("");

      handleClose();

      addMarker();
      setActiveStep(0);
      setImage("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    if (!open) {
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
