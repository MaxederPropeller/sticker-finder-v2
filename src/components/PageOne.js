// PageOne.js
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styles } from "../styles/styles";

const PageOne = ({ coordinates, setCoordinates, onContinue }) => {
  return (
    <div>
      <TextField
        margin="dense"
        label="Koordinaten"
        type="text"
        fullWidth
        value={coordinates}
        onChange={(e) => setCoordinates(e.target.value)}
      />
      <Button style={styles.button} onClick={onContinue}>
        Weiter
      </Button>
    </div>
  );
};

export default PageOne;
