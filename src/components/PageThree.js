// PageThree.js
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const styles = {
  button: {
    backgroundColor: "#0099cc",
    color: "#fff",
    margin: "5px",
  },
};

const PageThree = ({
  title,
  setTitle,
  description,
  setDescription,
  onContinue,
  onBack,
}) => {
  return (
    <div>
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
      <Button style={styles.button} onClick={onBack}>
        Zurück
      </Button>
      <Button style={styles.button} onClick={onContinue}>
        Weiter
      </Button>
    </div>
  );
};

export default PageThree;
