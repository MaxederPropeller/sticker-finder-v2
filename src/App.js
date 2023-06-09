import Header from "./components/Header";
import Map from "./components/Map";

import "./index.css";

import React from "react";
import { MarkerProvider } from "./components/MarkerContext";
import MarkerForm from "./components/MarkerForm";

function App() {
  return (
    <MarkerProvider>
      <MarkerForm />
      <div className="App">
        <Header />
        <Map />
      </div>
    </MarkerProvider>
  );
}

export default App;
