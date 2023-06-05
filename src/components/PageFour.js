// PageFour.js
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const styles = {
  title: {
    color: "#0066cc",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  card: {
    backgroundColor: "#f2f2f2",
    marginBottom: "10px",
  },
  button: {
    backgroundColor: "#0099cc",
    color: "#fff",
    margin: "5px",
  },
};

const PageFour = ({
  title,
  description,
  coordinates,
  image,
  onSubmit,
  onBack,
}) => {
  return (
    <div>
      <Typography style={styles.title} variant="h6" component="div">
        Überprüfung Ihrer Eingaben
      </Typography>
      <Card style={styles.card}>
        <CardContent>
          <Typography variant="h6" component="div">
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
      <Button style={styles.button} variant="outlined" onClick={onBack}>
        Zurück
      </Button>
      <Button style={styles.button} variant="contained" onClick={onSubmit}>
        Absenden
      </Button>
    </div>
  );
};

export default PageFour;
