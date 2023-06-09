import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import MapMarker from "./Marker";
import { Paper, Switch } from "@mui/material";
import { styled } from "@mui/system";
import { Snackbar, Alert, Box } from "@mui/material";
import { getDistance } from "geolib";
import DialogMaster from "./Dialogmaster";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const StyledMapContainer = styled(Paper)({
  height: "95vh",
  width: "100vw",
  borderRadius: "4px",
  flexGrow: 1,
  zIndex: 0,
  boxShadow:
    "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  background: "linear-gradient(to right, violet, blue)",
  overflow: "hidden",
});

const ControlsContainer = styled("div")({
  position: "absolute",
  width: "100vw",
  bottom: 8,
  left: 8,
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  fontSize: "1.1rem",
  fontStyle: "bold",
});

function MapInitializer() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

const roundCoord = (coord) => {
  return Math.round(coord * 1e4) / 1e4;
};

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [geoCacheEnabled, setGeoCacheEnabled] = useState(true);
  const [allMarkers, setAllMarkers] = useState([]);
  const [selectedTileLayer, setSelectedTileLayer] = useState("osm");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reloadMarkers, setReloadMarkers] = useState(false);
  const [prevMarkersLength, setPrevMarkersLength] = useState(0);

  const openDialogform = () => {
    setDialogOpen(true);
  };
  const closeDialogform = () => {
    setDialogOpen(false);
  };

  const toggleTileLayer = () => {
    setSelectedTileLayer((prevLayer) => (prevLayer === "osm" ? "esri" : "osm"));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway" || reason === "timeout") {
      return;
    }
    setSnackbarOpen(false);
  };

  const position = useMemo(() => [46.7, 8.0], []);

  const fetchMarkers = useCallback(async () => {
    const markerCollection = collection(db, "markers");
    const markerSnapshot = await getDocs(markerCollection);
    const markerList = markerSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      coordinates: [
        roundCoord(parseFloat(doc.data().coordinates.latitude)),
        roundCoord(parseFloat(doc.data().coordinates.longitude)),
      ],
    }));

    setAllMarkers(markerList);
  }, [db]);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  useEffect(() => {
    // Wenn reloadMarkers true ist, laden Sie die Marker erneut und setzen Sie reloadMarkers zurück auf false
    if (reloadMarkers) {
      fetchMarkers();
      setReloadMarkers(false);
    }
  }, [fetchMarkers, reloadMarkers]);

  useEffect(() => {
    // Vergleichen Sie die aktuelle Länge von 'markers' mit der vorher gespeicherten Länge
    if (markers.length === prevMarkersLength + 1) {
      setSnackbarOpen(true);
    }

    // Aktualisieren Sie die gespeicherte Länge
    setPrevMarkersLength(markers.length);
  }, [markers, prevMarkersLength]);

  useEffect(() => {
    if (!geoCacheEnabled) {
      setMarkers(allMarkers);
    } else {
      const filteredMarkerList = allMarkers.filter((marker) => {
        const distance = getDistance(
          { latitude: position[0], longitude: position[1] },
          { latitude: marker.coordinates[0], longitude: marker.coordinates[1] }
        );

        return distance <= 40000000;
      });

      setMarkers(filteredMarkerList);
    }
  }, [geoCacheEnabled, allMarkers, position]);

  const groupedMarkers = useMemo(() => {
    return markers.reduce((grouped, marker) => {
      const key = marker.coordinates.map(roundCoord).join(",");
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(marker);
      return grouped;
    }, {});
  }, [markers]);

  return (
    <StyledMapContainer>
      <MapContainer
        center={position}
        zoom={9}
        style={{ height: "100%", width: "100%" }}
      >
        <MapInitializer />
        {selectedTileLayer === "osm" ? (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        ) : (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          />
        )}
        {Object.values(groupedMarkers).map((markerGroup, index) => {
          const marker = markerGroup[0];
          const markerDate = new Date(marker.timestamp.seconds * 1000);
          const now = new Date();
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

          const isNew = markerDate >= oneDayAgo;

          return (
            <MapMarker
              key={index}
              position={marker.coordinates}
              data={markerGroup}
              isNew={isNew}
            />
          );
        })}
      </MapContainer>

      <ControlsContainer>
        <Box>
          <Switch
            checked={selectedTileLayer === "esri"}
            onChange={toggleTileLayer}
            name="Toggle Map"
            inputProps={{ "aria-label": "Toggle between tile layers" }}
          />
          <label
            style={{
              color: selectedTileLayer === "esri" ? "red" : "blue",
            }}
          >
            {selectedTileLayer === "esri" ? "Maps" : "Satellit"}
          </label>
        </Box>
        {dialogOpen && (
          <DialogMaster
            id="my-dialog-id"
            open={dialogOpen}
            onClose={closeDialogform}
            setReloadMarkers={setReloadMarkers}
          />
        )}

        <Fab
          color="primary"
          aria-label="add"
          onClick={openDialogform}
          sx={{
            alignSelf: "flex-end",
            position: "absolute",
            bottom: "0px",
            right: "0px",
            margin: "1.5rem",
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      </ControlsContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Marker erfolgreich hinzugefügt!
        </Alert>
      </Snackbar>
    </StyledMapContainer>
  );
};

export default Map;
