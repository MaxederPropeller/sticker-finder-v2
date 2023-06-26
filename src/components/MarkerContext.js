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
  const [reloadMarkers, setReloadMarkers] = useState(false);

  const loadMarkers = async () => {
    try {
      const markers = await fetchMarkers();
      setMarkerCount(markers);
      setReloadMarkers(false);
    } catch (error) {}
  };

  // Direktes Aufrufen von loadMarkers beim ersten Rendering
  loadMarkers();

  useEffect(() => {
    // useEffect führt loadMarkers aus, wenn reloadMarkers true ist
    if (reloadMarkers) {
      loadMarkers();
    }
  }, [reloadMarkers]);

  const addMarker = () => {
    setMarkerCount(markerCount + 1);
    setReloadMarkers(true); // Zustand auf true setzen, wenn ein Marker hinzugefügt wird
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
