/* const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");

admin.initializeApp();

const gcs = new Storage();

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.createThumbnail = functions.storage
  .object()
  .onFinalize(async (object) => {
    // Der Dateipfad in Firebase Storage.
    const filePath = object.name;
    // Der Dateiname
    const fileName = filePath.split("/").pop();

    // Wenn der Dateiname bereits "thumb" enthält, beenden wir die Funktion frühzeitig.
    if (fileName.includes("thumb")) {
      console.log("Das Bild ist bereits ein Thumbnail.");
      return;
    }

    // Der neue Dateiname.
    const newFileName = "thumb" + fileName;

    // Der vollständige Pfad der neuen Datei in Firebase Storage.
    const newFilePath = filePath.replace(fileName, newFileName);

    // Referenzen zu den alten und neuen Dateien.
    const bucket = gcs.bucket(object.bucket);
    const file = bucket.file(filePath);
    const newFile = bucket.file(newFilePath);

    // Kopieren der Datei.
    return file.copy(newFile);
  }); */
