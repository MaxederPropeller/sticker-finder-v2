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
    const storage = getStorage();

    if (!isValidImageFile(uploadedFile)) {
      alert("Bitte lade eine Bilddatei hoch");
      setUploading(false);
      return;
    }
    const toBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const uploadFile = async (file) => {
      const uniqueFileName = `${file.name}-${uuidv4()}`;
      const storageRef = ref(storage, `kapkan/${uniqueFileName}`);
      const base64String = await toBase64(file);
      const snapshot = await uploadString(storageRef, base64String, "data_url");
      return getDownloadURL(snapshot.ref);
    };

    const handleEXIFData = (file) => {
      EXIF.getData(file, function () {
        let lat = EXIF.getTag(this, "GPSLatitude");
        let lon = EXIF.getTag(this, "GPSLongitude");

        if (lat && lon) {
          lat = (lat[0] + lat[1] / 60 + lat[2] / 3600).toFixed(6);
          lon = (lon[0] + lon[1] / 60 + lon[2] / 3600).toFixed(6);
        }

        console.log(`EXIF Geodaten: Breitengrad = ${lat}, Längengrad = ${lon}`);

        if (lat && lon) {
          setCoordinates(`${lat}, ${lon}`);
        } else {
          fetchCoordinates();
        }
      });
    };

    const uniqueFileName = `${uploadedFile.name}-${uuidv4()}`;
    const storageRef = ref(storage, `kapkan/${uniqueFileName}`);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      const snapshot = await uploadString(storageRef, base64String, "data_url");
      const url = await getDownloadURL(snapshot.ref);

      EXIF.getData(uploadedFile, function () {
        let lat = EXIF.getTag(this, "GPSLatitude");
        let lon = EXIF.getTag(this, "GPSLongitude");

        if (lat && lon) {
          lat = (lat[0] + lat[1] / 60 + lat[2] / 3600).toFixed(6);
          lon = (lon[0] + lon[1] / 60 + lon[2] / 3600).toFixed(6);
        }

        console.log(`EXIF Geodaten: Breitengrad = ${lat}, Längengrad = ${lon}`);

        if (lat && lon) {
          setCoordinates(`${lat}, ${lon}`);
        } else {
          fetchCoordinates();
        }
      });

      setImage(url);
      setUploading(false);
      e.target.value = "";
    };
    reader.readAsDataURL(uploadedFile);
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
