// MarkerContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Stellen Sie sicher, dass dies der Pfad zu Ihrer Firestore-Instanz ist

export const MarkerContext = createContext();

export function MarkerProvider({ children }) {
  const [markerCount, setMarkerCount] = useState(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      const markersCollection = collection(db, "markers");
      const markerSnapshot = await getDocs(markersCollection);
      setMarkerCount(markerSnapshot.size);
    };

    fetchMarkers();
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
