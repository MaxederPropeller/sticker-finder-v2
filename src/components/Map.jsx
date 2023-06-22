import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useReducer,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import MapMarker from "./Marker";
import { Paper, Fab, Switch } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/system";

import { Snackbar, Alert } from "@mui/material";
import { getDistance } from "geolib";
import { storage } from "../firebaseConfig";
import { UploadPage, GeocachePage, OverviewPage } from "./multistepForm";

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

const StyledFab = styled(Fab)({
  position: "absolute",
  bottom: "16px",
  right: "16px",
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

const ControlsContainer = styled("div")({
  position: "absolute",
  bottom: 8,
  left: 8,
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  fontSize: "1.1rem",
  fontStyle: "bold",
});

const roundCoord = (coord) => {
  return Math.round(coord * 1e4) / 1e4;
};

const NEXT = "NEXT";
const BACK = "BACK";
const SET_DATA = "SET_DATA";
const OPEN_FORM = "OPEN_FORM";
const CLOSE_FORM = "CLOSE_FORM";

function reducer(state, action) {
  switch (action.type) {
    case NEXT:
      return { ...state, currentStepIndex: state.currentStepIndex + 1 };
    case BACK:
      return { ...state, currentStepIndex: state.currentStepIndex - 1 };
    case SET_DATA:
      return { ...state, data: { ...state.data, ...action.data } };
    case OPEN_FORM:
      return { ...state, formIsOpen: true };
    case CLOSE_FORM:
      return { ...state, formIsOpen: false, currentStepIndex: 0, data: {} };
    default:
      return state;
  }
}

const Map = () => {
  const [open, setOpen] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [geoCacheEnabled, setGeoCacheEnabled] = useState(true);
  const [allMarkers, setAllMarkers] = useState([]);
  const [selectedTileLayer, setSelectedTileLayer] = useState("osm");

  const toggleTileLayer = () => {
    setSelectedTileLayer((prevLayer) => (prevLayer === "osm" ? "esri" : "osm"));
  };

  const onMarkerAdded = () => {
    fetchMarkers();
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
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
    if (!geoCacheEnabled) {
      setMarkers(allMarkers);
    } else {
      const filteredMarkerList = allMarkers.filter((marker) => {
        const distance = getDistance(
          { latitude: position[0], longitude: position[1] },
          { latitude: marker.coordinates[0], longitude: marker.coordinates[1] }
        );

        return distance <= 200000;
      });

      setMarkers(filteredMarkerList);
    }
  }, [geoCacheEnabled, allMarkers, position]);
  const [state, dispatch] = useReducer(reducer, {
    currentStepIndex: 0,
    data: {},
    formIsOpen: false,
  });

  function openForm() {
    dispatch({ type: OPEN_FORM });
  }

  function closeForm() {
    dispatch({ type: CLOSE_FORM });
  }

  function next() {
    dispatch({ type: NEXT });
  }

  function back() {
    dispatch({ type: BACK });
  }

  function setData(data) {
    dispatch({ type: SET_DATA, data });
  }

  async function submit(data) {
    // Implementiere das Senden der Daten an Firestore und das Speichern des Bildes im Storage Bucket
    const filename = `kapkan_bilder_Sticker_${uuidv4()}`;

    // Upload the image to the bucket
    const imageRef = storage.ref(`kapkan/${filename}`);
    const snapshot = await imageRef.put(data.image);
    const imageUrl = await snapshot.ref.getDownloadURL();

    // Save the data to Firestore
    const docRef = db.collection("markers").doc();
    await docRef.set({ ...data, imageUrl });

    closeForm();
    onMarkerAdded();
  }

  const steps = [
    <UploadPage next={next} setData={setData} />,
    <GeocachePage next={next} back={back} setData={setData} />,
    <OverviewPage
      data={state.data}
      back={back}
      submit={() => submit(state.data)}
    />,
  ];

  const groupedMarkers = useMemo(() => {
    return markers.reduce((grouped, marker) => {
      const key = marker.coordinates.map(roundCoord).join(","); // Verwenden Sie die Funktion roundCoord hier
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
        <div>
          <Switch
            checked={selectedTileLayer === "esri"}
            onChange={toggleTileLayer}
            name="Toggle Map"
            inputProps={{ "aria-label": "Toggle between tile layers" }}
          />
          <label
            style={{
              color: selectedTileLayer === "esri" ? "white" : "#343aeb",
            }}
          >
            {selectedTileLayer === "esri" ? "Maps" : "Satellit"}
          </label>
        </div>
        <div>
          <Switch
            checked={geoCacheEnabled}
            onChange={() => setGeoCacheEnabled(!geoCacheEnabled)}
            name="Geocaching"
            inputProps={{ "aria-label": "Geocaching aktivieren/deaktivieren" }}
          />
          <label
            style={{
              color: selectedTileLayer === "esri" ? "white" : "#343aeb",
            }}
          >
            Geocaching
          </label>
        </div>
      </ControlsContainer>
      <StyledFab color="primary" aria-label="add" onClick={openForm}>
        <AddIcon />
      </StyledFab>
      {state.formIsOpen && steps[state.currentStepIndex]}

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
