// PageTwo.js
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { styles } from "../styles/styles";

const PageTwo = ({ image, uploading, onImageUpload, onContinue, onBack }) => {
  return (
    <div>
      <TextField
        margin="dense"
        type="file"
        fullWidth
        onChange={onImageUpload}
        disabled={uploading}
      />
      {uploading && <CircularProgress />}
      <Button style={styles.button} onClick={onBack}>
        Zurück
      </Button>
      <Button style={styles.button} onClick={onContinue} disabled={uploading}>
        Weiter
      </Button>
    </div>
  );
};

export default PageTwo;
