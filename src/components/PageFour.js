// PageFour.js
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import { styles } from "../styles/styles";

const PageFour = ({
  title,
  description,
  coordinates,
  image,
  onSubmit,
  onBack,
}) => {
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
        <Button style={styles.button} variant="outlined" onClick={onBack}>
          Zurück
        </Button>
        <Button style={styles.button} variant="contained" onClick={onSubmit}>
          Absenden
        </Button>
      </div>
    </div>
  );
};

export default PageFour;
