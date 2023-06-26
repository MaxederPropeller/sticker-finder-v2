import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Alert, TextField, Snackbar } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { v4 as uuidv4 } from "uuid";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import imageCompression from "browser-image-compression";
import { Button, DialogTitle } from "@mui/material";
import {
  StyledDialogTitle,
  StyledDialogContent,
  StyledDialogActions,
  StyledButton,
  StyledIconButton,
} from "../styles/MarkerForm";

const UploadPage = ({ next, setData }) => {
  const { register, handleSubmit } = useForm();
  const [selectedfile, setSelectedfile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const handleCloseSnackbar = (event, reason, closeDialog) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
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

  const handleFileChange = (event) => {
    setSelectedfile(event.target.files[0]);
  };

  const onSubmit = async (data) => {
    if (selectedfile && isValidImageFile(selectedfile)) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(selectedfile, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = function () {
        const base64data = reader.result;
        uploadImage(base64data);
      };
    }
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      const uniqueImageName = `kapkan_bilder_sticker_${uuidv4()}`;
      const storage = getStorage();
      const storageRef = ref(storage, `kapkan/${uniqueImageName}`);
      await uploadString(storageRef, base64EncodedImage, "data_url");
      const url = await getDownloadURL(storageRef);

      next({ image: url });
      setUploadSuccess(true);
      setOpenSnackbar(true);
      setSnackbarSeverity("success");
      setSnackbarMessage("Bild erfolgreich hochgeladen!");
    } catch (error) {
      setUploadSuccess(false);
      setOpenSnackbar(true);
      setSnackbarSeverity("error");
      setSnackbarMessage("Fehler beim Hochladen des Bildes!");
    }
  };

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <StyledDialogTitle selectedfile={selectedfile}>
        {selectedfile ? "Bild ausgewählt" : "Bild hochladen"}
      </StyledDialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledDialogContent>
          <StyledIconButton color="primary" component="label">
            <CameraAltIcon />
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
            type="submit"
            variant="contained"
            color={selectedfile ? "success" : "primary"}
            disabled={!selectedfile}
          >
            Weiter
          </StyledButton>
        </StyledDialogActions>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default UploadPage;
