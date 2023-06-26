import React, { useState } from "react";
import {
  collection,
  addDoc,
  GeoPoint,
  serverTimestamp,
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import Dialog from "@mui/material/Dialog";

import { db } from "../firebaseConfig";
import UploadPage from "./UploadPage";
import OverviewPage from "./OverviewPage";
import GeocachePage from "./GeocachePage";

const DialogMaster = ({ open, onClose, setReloadMarkers }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dialogData, setDialogData] = useState({
    coordinates: { lat: 0, lng: 0 },
  });

  const handleClose = () => {
    onClose();
  };
  const handleNext = (newData) => {
    const updatedData = {
      ...dialogData,
      ...newData,
    };

    setCurrentStep(currentStep + 1);
    setDialogData(updatedData);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // Validate data and data.coordinates
    if (
      !dialogData ||
      !dialogData.coordinates ||
      typeof dialogData.coordinates.lat === "undefined" ||
      typeof dialogData.coordinates.lng === "undefined"
    ) {
      return;
    }

    try {
      const { lat, lng } = dialogData.coordinates;
      const geoPoint = new GeoPoint(lat, lng);

      const docRef = await addDoc(collection(db, "markers"), {
        coordinates: geoPoint,
        timestamp: Timestamp.now(),
        image: dialogData.image,
        description: dialogData.description,
        title: dialogData.address,
      });

      setCurrentStep(0);
      setDialogData({});
      handleClose();
      // Setzen Sie reloadMarkers auf true, wenn das Formular erfolgreich abgesendet wurde
      setReloadMarkers(true);
    } catch (error) {
      console.error("Fehler beim Hinzufügen eines Dokuments: ", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <UploadPage next={handleNext} setData={setDialogData} />;
      case 1:
        return (
          <GeocachePage
            next={handleNext}
            back={handleBack}
            setData={setDialogData}
          />
        );
      case 2:
        return (
          <OverviewPage
            data={dialogData}
            back={handleBack}
            submit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          handleClose();
          // Hier können Sie zusätzliche Logik hinzufügen, wenn der Dialog durch Escape oder ClickAway geschlossen wird
        }
      }}
      maxWidth="sm"
      fullWidth
    >
      {currentStep === 0 && (
        <UploadPage
          next={handleNext}
          setData={setDialogData}
          onClose={onClose}
        />
      )}
      {currentStep === 1 && (
        <GeocachePage
          next={handleNext}
          back={handleBack}
          setData={setDialogData}
          onClose={onClose}
        />
      )}
      {currentStep === 2 && (
        <OverviewPage
          data={dialogData}
          back={handleBack}
          submit={handleSubmit}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
};

export default DialogMaster;
