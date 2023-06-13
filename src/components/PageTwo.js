import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import { styles } from "../styles/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const PageTwo = ({ image, uploading, onImageUpload, onContinue, onBack }) => {
  const [imageUploaded, setImageUploaded] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const MAX_SIZE_MB = 15;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // 15MB in bytes

  const handleImageUpload = async (event) => {
    setImageUploaded(false); // reset state when new file is being uploaded
    setUploadError(false); // reset error state

    // Check file size
    const file = event.target.files[0];
    if (file.size > MAX_SIZE_BYTES) {
      setSnackbarOpen(true);
      return;
    }

    try {
      await onImageUpload(event);
      setImageUploaded(true); // set state to true when upload is successful
    } catch {
      setUploadError(true); // set error state if upload fails
    }
  };

  useEffect(() => {
    if (!uploading && imageUploaded) {
      onContinue();
    }
  }, [uploading, imageUploaded]);

  return (
    <Box className="dialogContainer2">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
          severity="error"
          elevation={6}
          variant="filled"
        >
          Die Datei ist zu groß. Bitte laden Sie eine Datei hoch, die kleiner
          als 15MB ist.
        </Alert>
      </Snackbar>

      <label htmlFor="file-upload">
        <Button
          component="span"
          startIcon={
            <>
              {uploading ? (
                <CircularProgress
                  sx={{
                    color: "hsl(250, 84%, 54%)",
                    thickness: 5,
                    animation: "spin 2s linear infinite",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
              ) : uploadError ? (
                <CloseIcon
                  sx={{
                    fontSize: "inherit",
                    transform: "scale(4.5)",
                    color: "hsl(250, 84%, 54%)",
                    paddingBottom: 3,
                    paddingTop: 3,
                    margin: 4,
                  }}
                />
              ) : (
                <CameraAltIcon
                  sx={{
                    fontSize: "inherit",
                    transform: "scale(4.5)",
                    color: "hsl(250, 84%, 54%)",
                    paddingBottom: 3,
                    paddingTop: 3,
                    margin: 4,
                  }}
                />
              )}
            </>
          }
          sx={{ pl: 1 }}
          disabled={uploading}
        />
      </label>
      <Input
        id="file-upload"
        type="file"
        sx={{ display: "none" }}
        onChange={handleImageUpload}
        disabled={uploading}
        value={undefined}
      />
      {uploadError && (
        <FormHelperText error>
          Es gab einen Fehler beim Hochladen. Bitte versuchen Sie es erneut.
        </FormHelperText>
      )}
      {!imageUploaded && !uploading && (
        <Typography variant="caption" color="error.main">
          Bitte laden Sie ein Bild hoch, bevor Sie fortfahren.
        </Typography>
      )}
      {/*  <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}
      >
        <Button style={styles.button} onClick={onBack}>
          {" "}
          <ArrowBackIcon />
        </Button>
        <Button
          style={imageUploaded ? styles.buttonWait : styles.buttonGo}
          onClick={onContinue}
          disabled={!imageUploaded || uploading}
        >
          {imageUploaded ? <ArrowForwardIcon /> : <CloseIcon />}
        </Button>
      </Box> */}
    </Box>
  );
};

export default PageTwo;
