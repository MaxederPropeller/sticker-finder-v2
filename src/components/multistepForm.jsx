import React from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import {
  doc,
  setDoc,
  GeoPoint,
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // Stellen Sie

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#f44336",
  "&.upload-success": {
    backgroundColor: "#4caf50",
  },
}));

const StyledDialogTitleEnd = styled(({ data, ...other }) => (
  <DialogTitle {...other} />
))(({ theme, data }) => ({
  textAlign: "center",
  color: "#fff",
  backgroundColor:
    data && data.image && data.coords && data.description
      ? "#4caf50"
      : "#f44336",
}));

const StyledDialogContent = styled(DialogContent)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const StyledDialogActions = styled(DialogActions)({
  justifyContent: "center",
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: "8px",
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  fontSize: "large",
}));

export function UploadPage({ next, setData }) {
  const { register, handleSubmit } = useForm();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);

  const onSubmit = async (data) => {
    if (selectedFile) {
      try {
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 500,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(selectedFile, options);
        const uniqueFileName = `kapkan_bilder_sticker${uuidv4()}`;

        // Hier ändern wir die storageRef
        const storageRef = ref(storage, `kapkan/${uniqueFileName}`);

        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.error(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setData({ image: downloadURL });
            next();
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadSuccess(true); // Set status to success as soon as a file is selected
  };

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledDialogTitle className={uploadSuccess ? "upload-success" : ""}>
          Bild hochladen
        </StyledDialogTitle>
        <StyledDialogContent>
          <StyledIconButton
            color="primary"
            component="label"
            style={{ fontSize: "3em" }}
          >
            <CameraAltIcon fontSize="inherit" />
            <input
              type="file"
              hidden
              {...register("image", { required: true })}
              onChange={handleFileChange}
            />
          </StyledIconButton>
        </StyledDialogContent>
        <StyledDialogActions>
          <StyledButton
            variant="contained"
            style={{
              color: "#fff",
              backgroundColor: uploadSuccess ? "#4caf50" : "#f44336",
            }}
            type="submit"
            disabled={!selectedFile}
          >
            Weiter
          </StyledButton>
        </StyledDialogActions>
      </form>
    </Dialog>
  );
}
export function GeocachePage({ next, back, setData }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState({});
  const [description, setDescription] = useState("");
  const [allGeoInfoAvailable, setAllGeoInfoAvailable] = useState(false);

  const fetchLocationDetails = async (latitude, longitude) => {
    const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
    );
    const data = await response.json();
    const components = data.results[0].components;
    setAddress({
      street: components.road || components.suburb || "Unglaubliche Strasse",
      number: components.house_number || "",
      city: components.city || "Fantastischer Ort",
      state: components.state || "Wow hier war ich noch nie",
      country: components.country || "Das Land kennt niemand",
    });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
      setLocation(coords);
      await fetchLocationDetails(
        position.coords.latitude,
        position.coords.longitude
      );
    });
  }, []);
  useEffect(() => {
    if (location && address.street !== "Unglaubliche Strasse" && description) {
      setAllGeoInfoAvailable(true);
    } else {
      setAllGeoInfoAvailable(false);
    }
  }, [location, address, description]);

  const onSubmit = (data) => {
    setDescription(data.description);
    setData({
      coords: location,
      description: data.description,
      address: address,
    });
    next();
  };

  const addressDetails = `${address.street} ${address.number}\n${address.city}\n${address.state}\n${address.country}`;

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledDialogTitle
          className={allGeoInfoAvailable ? "upload-success" : ""}
        >
          Geocache Details
        </StyledDialogTitle>
        <StyledDialogContent>
          <TextField
            label="Koordinaten"
            value={location}
            disabled
            style={{ marginBottom: "10px", marginTop: "10px" }} // Top margin added here
          />
          <TextField
            label="Adresse"
            value={addressDetails}
            multiline // Multi-line added here
            disabled={address.street === "Unglaubliche Strasse"}
            style={{ marginBottom: "10px", marginTop: "10px" }} // Top margin added here
          />
          <TextField
            {...register("description", { required: true })}
            label="Beschreibung"
            multiline // Multi-line added here
            error={errors.description ? true : false}
            helperText={errors.description && "Beschreibung ist erforderlich."}
            color={errors.description ? "secondary" : "primary"}
            style={{ marginBottom: "10px", marginTop: "10px" }} // Top margin added here
            onChange={(e) => setDescription(e.target.value)}
          />
        </StyledDialogContent>
        <StyledDialogActions>
          <StyledButton variant="contained" onClick={back}>
            Zurück
          </StyledButton>
          <StyledButton
            variant="contained"
            color={allGeoInfoAvailable ? "primary" : "secondary"}
            type="submit"
            disabled={!allGeoInfoAvailable}
          >
            Weiter
          </StyledButton>
        </StyledDialogActions>
      </form>
    </Dialog>
  );
}

export function OverviewPage({ data, back, submit }) {
  const handleSubmission = async () => {
    try {
      // Convert string coordinates into a Firestore GeoPoint
      const coordsArray = data.coords
        .split(",")
        .map((coord) => parseFloat(coord));
      const geopoint = new GeoPoint(coordsArray[0], coordsArray[1]);

      // Generate a Timestamp for "now"
      const now = Timestamp.now();

      // Construct address title
      const { street, number, city, state, country } = data.address;
      const title = `${street} ${number}, ${city}, ${state}, ${country}`;

      // Get filename from image URL
      const url = new URL(data.image);
      const altText = url.pathname.split("/").pop();

      // Use addDoc to add a new document to the collection and automatically generate an ID
      const docRef = await addDoc(collection(db, "markers"), {
        coordinates: geopoint,
        timestamp: now,
        description: data.description,
        image: data.image,
        title: title,
        altText: altText,
      });

      console.log("Document written with ID: ", docRef.id);
      alert("Marker erfolgreich hinzugefügt!");
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Markers: ", error);
    }

    submit();
  };
  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <StyledDialogTitleEnd data={data}>Übersicht</StyledDialogTitleEnd>

      <StyledDialogContent>
        <img
          src={data.image}
          alt="Uploaded"
          style={{ maxWidth: "100%", height: "auto", marginTop: "20px" }}
        />
        <p>Koordinaten: {data.coords}</p>
        <p>Beschreibung: {data.description}</p>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="contained" onClick={back}>
          Zurück
        </StyledButton>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleSubmission}
        >
          Abschicken
        </StyledButton>
      </StyledDialogActions>
    </Dialog>
  );
}
