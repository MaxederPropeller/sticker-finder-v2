// PageTwo.js
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { styles } from "../styles/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const PageTwo = ({ image, uploading, onImageUpload, onContinue, onBack }) => {
  return (
    <div className="dialogContainer">
      <TextField
        margin="dense"
        type="file"
        fullWidth
        onChange={onImageUpload}
        disabled={uploading}
      />
      {uploading && <CircularProgress />}
      <div>
        <Button style={styles.button} onClick={onBack}>
          <ArrowBackIcon />
        </Button>
        <Button style={styles.button} onClick={onContinue} disabled={uploading}>
          <ArrowForwardIcon />
        </Button>
      </div>
    </div>
  );
};

export default PageTwo;
