import React, { useState } from "react";
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

const PageTwo = ({ image, uploading, onImageUpload, onContinue, onBack }) => {
  const [imageUploaded, setImageUploaded] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const handleImageUpload = (event) => {
    setImageUploaded(false); // reset state when new file is being uploaded
    onImageUpload(event)
      .then(() => {
        setImageUploaded(true); // set state to true when upload is successful
        setUploadError(false); // reset error state
      })
      .catch(() => setUploadError(true)); // set error state if upload fails
  };

  return (
    <Box className="dialogContainer">
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
              ) : imageUploaded ? (
                <CheckCircleIcon
                  sx={{
                    fontSize: "inherit",
                    transform: "scale(4.5)",
                    color: "hsl(150, 64%, 54%)",
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
      <Box
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
      </Box>
    </Box>
  );
};

export default PageTwo;
