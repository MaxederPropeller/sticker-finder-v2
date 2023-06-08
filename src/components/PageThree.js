// PageThree.js
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { styles } from "../styles/styles";

const PageThree = ({
  title,
  setTitle,
  description,
  setDescription,
  onContinue,
  onBack,
}) => {
  return (
    <div className="dialogContainer">
      <TextField
        margin="dense"
        label="Title"
        type="text"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        margin="dense"
        label="Beschreibung"
        type="text"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div>
        <Button style={styles.button} onClick={onBack}>
          <ArrowBackIcon />
        </Button>
        <Button style={styles.button} onClick={onContinue}>
          <ArrowForwardIcon />
        </Button>
      </div>
    </div>
  );
};

export default PageThree;
