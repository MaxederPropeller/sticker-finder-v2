import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import blockedWords from "./blockedWords.json";

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
    // Splits the description into words
    const descriptionWords = description.split(" ");

    // Checks if any of the words are in the blocked words list
    const containsBlockedWord = descriptionWords.some((word) =>
      blockedWords.words.includes(word)
    );

    // Aktualisierte Regex, die Umlaute und französische Akzente berücksichtigt
    const regex =
      /^[\w\s@#,.\-!?()"'\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]+$/;

    return (
      description.trim() === "" ||
      (regex.test(description) && // Erlaubt Buchstaben, Zahlen, Leerzeichen, @, #, Komma, Punkt, Bindestrich, Ausrufezeichen, Fragezeichen, Anführungszeichen, Klammer, Umlaute, französische Akzente
        !containsBlockedWord) // Überprüft, ob die Beschreibung ein blockiertes Wort enthält
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
        "Die Beschreibung ist nicht mit unseren Inhaltsrichtlinien vereinbar. Bitte verwenden Sie eine andere Beschreibung."
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
