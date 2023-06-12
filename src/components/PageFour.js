import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";

import { styles } from "../styles/styles";

const PageFour = ({
  title,
  description,
  coordinates,
  image,
  onSubmit,
  onBack,
}) => {
  // Validierungsfunktionen
  const validateTitle = (title) => {
    return title.trim() !== "";
  };

  const validateDescription = (description) => {
    return (
      description.trim() === "" || /^[\w\s@#]+$/.test(description) // Erlaubt Buchstaben, Zahlen, Leerzeichen, @ und #
    );
  };

  const validateCoordinates = (coordinates) => {
    return coordinates.trim() !== "";
  };

  const validateImage = (image) => {
    return !!image; // Überprüft, ob das Bild vorhanden ist
  };

  // Überprüfung der Validierung beim Einreichen
  const handleOnSubmit = () => {
    if (!validateTitle(title)) {
      alert("Bitte geben Sie einen Titel ein.");
    } else if (!validateDescription(description)) {
      alert(
        "Die Beschreibung darf nur Buchstaben, Zahlen, Leerzeichen, @ und # enthalten."
      );
    } else if (!validateCoordinates(coordinates)) {
      alert("Bitte geben Sie die Koordinaten ein.");
    } else if (!validateImage(image)) {
      alert("Bitte laden Sie ein Bild hoch.");
    } else {
      onSubmit();
    }
  };

  return (
    <div className="dialogContainer">
      <Typography style={styles.title} variant="body1" component="div">
        Bitte überprüfe deine Entdeckung.
      </Typography>
      <Card style={styles.card}>
        <CardContent>
          <Typography variant="body1" component="div">
            <strong>Titel:</strong> {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Beschreibung:</strong> {description}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Koordinaten:</strong> {coordinates}
          </Typography>
        </CardContent>
        {image && (
          <CardMedia component="img" image={image} alt="Uploaded Image" />
        )}
      </Card>
      <div>
        <Button style={styles.buttontwo} variant="outlined" onClick={onBack}>
          <ArrowBackIcon />
        </Button>
        <Button
          style={styles.button}
          variant="contained"
          onClick={handleOnSubmit}
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  );
};

export default PageFour;
