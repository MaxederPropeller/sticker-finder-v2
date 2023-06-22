import React, { createContext, useState, useContext, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const MarkerContext = createContext();

const fetchMarkers = async () => {
  const markersCollection = collection(db, "markers");
  const markerSnapshot = await getDocs(markersCollection);
  return markerSnapshot.size;
};

export function MarkerProvider({ children }) {
  const [markerCount, setMarkerCount] = useState(null);

  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const markers = await fetchMarkers();
        setMarkerCount(markers);
      } catch (error) {
        console.error("Failed to fetch markers", error);
        // hier könnten Sie auch einen Fehlerzustand festlegen und diesen in Ihrer Anwendung anzeigen
      }
    };

    loadMarkers();
  }, []);

  const addMarker = () => {
    setMarkerCount(markerCount + 1);
  };

  return (
    <MarkerContext.Provider value={{ markerCount, addMarker }}>
      {children}
    </MarkerContext.Provider>
  );
}

export function useMarkers() {
  const context = useContext(MarkerContext);
  if (context === undefined) {
    throw new Error("useMarkers must be used within a MarkerProvider");
  }
  return context;
}
