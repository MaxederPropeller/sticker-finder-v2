import React, { useState, useEffect } from "react";

import { useMarkers } from "./MarkerContext";
import {
  AppBar,
  Toolbar,
  Link,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Slide,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Importieren Sie Ihre Firestore-Instanz
import "../index.css";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LanguageIcon from "@mui/icons-material/Language";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [totalMarkers, setTotalMarkers] = useState(0);
  const [newMarkers, setNewMarkers] = useState(0);
  const { markerCount } = useMarkers();

  useEffect(() => {
    const fetchMarkers = async () => {
      const markersCollection = collection(db, "markers");
      const markerSnapshot = await getDocs(markersCollection);
      setTotalMarkers(markerSnapshot.size);

      const lastVisit = localStorage.getItem("lastVisit");
      if (lastVisit) {
        const newMarkerQuery = query(
          markersCollection,
          where("timestamp", ">", new Date(lastVisit)),
          orderBy("timestamp")
        );
        const newMarkerSnapshot = await getDocs(newMarkerQuery);
        setNewMarkers(newMarkerSnapshot.size);
      }

      localStorage.setItem("lastVisit", new Date().toISOString());
    };

    fetchMarkers();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDialogOpen = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const menuItems = [
    "StickerFinder.ch",
    "KAPKAN!",
    "Wie bekomme ich KAPKAN! Sticker?",
    "Über uns",
    "Disclaimer",
    "AGB's/ Nutzerbedingungen",
    "Datenschutzerklärung",
    "Impressum",
    {
      icon: <InstagramIcon />,
      link: "https://www.instagram.com/kapkan.ch/",
      text: "@Kapkan.ch",
    },
    {
      icon: <FacebookIcon />,
      link: "https://www.facebook.com/kapkan.ch/",
      text: "Kapkan.ch",
    },
    {
      icon: <LanguageIcon />,
      link: "https://www.kapkan.ch/",
      text: "Kapkan.ch",
    },
    {
      icon: <InstagramIcon />,
      link: "https://www.instagram.com/stickerfinder.ch/",
      text: "@Stickerfinder.ch",
    },
  ];

  const TotalMarkerBanner = ({ totalMarkers, newMarkers }) => {
    return (
      <div className="Banner">
        <div
          style={{
            color: "white",
            textAlign: "center",
            padding: "10px",
            fontSize: "1rem",
          }}
        >
          !Aktuell wird die Seite gewartet. Es können zurzeit keine neuen
          Sticker hinzugefügt werden!
          {/*       Insgesamt {totalMarkers} Sticker gefunden! */}
        </div>

        <Slide direction="down" in={newMarkers > 0} mountOnEnter unmountOnExit>
          <div
            style={{
              color: "white",
              textAlign: "center",
              padding: "10px",
              fontSize: "1rem",
            }}
          >
            + {newMarkers} neue Sticker seit deinem letzten Besuch!
          </div>
        </Slide>
      </div>
    );
  };
  const getDialogContent = (item) => {
    switch (item) {
      case "StickerFinder.ch":
        return (
          <>
            <h2>Willkommen in der bunten Welt von StickerFinder.ch!</h2>
            <br />
            Stellen Sie sich eine Welt vor, in der Sticker mehr als nur
            Aufkleber sind. Eine Welt, in der jeder Sticker eine Geschichte
            erzählt, ein Abenteuer darstellt und eine Entdeckung wartet.
            Willkommen in dieser Welt, willkommen bei StickerFinder.ch!
            <br />
            <br />
            Aktuell sind wir auf der Jagd nach den legendären KAPKAN! Stickern.
            Aber das ist nur der Anfang! Unser Ziel ist es, das größte
            Sticker-Universum zu erschaffen, und dafür brauchen wir Eure Hilfe.
            <br />
            <br />
            Unsere interaktive Karte ist wie ein Schatzplan, der Sie zu den
            entdeckten Stickern führt. Haben Sie einen Sticker entdeckt, der
            noch nicht auf unserer Karte ist? Drücken Sie einfach den
            'Plus-Button' und teilen Sie Ihren Fund mit der Welt. Jeder Sticker,
            den Sie hinzufügen, hilft uns, das Sticker-Universum zu erweitern.
            Also, worauf warten Sie noch? Auf ins Abenteuer!
          </>
        );
      case "Wie bekomme ich KAPKAN! Sticker?":
        return (
          <>
            Sie sind auf der Suche nach den legendären KAPKAN! Stickern? Wir
            haben gute Nachrichten für Sie! Es gibt verschiedene Möglichkeiten,
            diese begehrten Sticker zu bekommen:
            <br />
            <br />
            <h3>1. KAPKAN! Shop</h3>
            Besuchen Sie den Shop auf kapkan.ch. Dort finden Sie eine Vielzahl
            von KAPKAN! Stickern, die Sie direkt online bestellen können.
            <br />
            <br />
            <h3>2. Kauf von KAPKAN! Produkten</h3>
            Bei jedem Kauf von KAPKAN! Produkten erhalten Sie KAPKAN! Sticker
            als kleines Dankeschön dazu. Eine tolle Möglichkeit, Ihre
            Stickersammlung zu erweitern!
            <br />
            <br />
            <h3>3. Veranstaltungen, Messen und Turnierabende</h3>
            Wir sind regelmäßig auf verschiedenen Veranstaltungen, Messen und
            Turnierabenden vertreten. Dort haben Sie die Chance, KAPKAN! Sticker
            als Geschenk zu erhalten. Schauen Sie vorbei, wir freuen uns auf
            Sie!
          </>
        );

      case "Über uns":
        return (
          <>
            <h2>Willkommen im Hauptquartier von StickerFinder.ch!</h2>
            <br />
            Hinter StickerFinder.ch steht ein buntes Team aus kreativen Köpfen,
            leidenschaftlichen Spielern und Sticker-Enthusiasten. Wir sind
            Programmierer, Designer, Künstler und Träumer, die zusammengekommen
            sind, um eine Plattform für Stickerliebhaber zu schaffen.
            <br />
            <br />
            Unsere Mission? Das Finden und Teilen von Stickern so einfach,
            spassig und zugänglich wie möglich zu machen! Wir glauben, dass
            Sticker mehr als nur Aufkleber sind. Sie sind Ausdruck von
            Kreativität, sie sind Kunstwerke, sie sind kleine Geschichten. Und
            wir wollen diese Geschichten mit der Welt teilen.
            <br />
            <br />
            Unser Labor ist immer in Betrieb, um neue Funktionen zu entwickeln
            und die Plattform zu verbessern. Wir experimentieren, wir testen,
            wir optimieren. Und wir hören nie auf zu träumen. Haben Sie eine
            geniale Idee oder eine Frage, die Sie nicht loslässt? Zögern Sie
            nicht und schreiben Sie uns eine E-Mail an info@astroboy.media. Wir
            freuen uns auf Ihre Nachricht!
          </>
        );
      case "Disclaimer":
        return (
          <>
            <h2>Haftungsausschluss</h2>
            <br />
            Bei StickerFinder.ch lieben wir Sticker und die Kreativität, die sie
            ausdrücken. Aber wir lieben auch Respekt und Rechtschaffenheit.
            Deshalb möchten wir klarstellen, dass wir niemanden dazu auffordern,
            Sticker an fremdem Eigentum zu platzieren.
            <br />
            <br />
            Das Anbringen von Stickern ohne Erlaubnis kann als Sachbeschädigung
            angesehen werden und rechtliche Konsequenzen nach sich ziehen. Wir
            übernehmen keine Verantwortung für das Platzieren von Stickern und
            die daraus resultierenden Folgen.
            <br />
            <br />
            Bitte respektieren Sie die Gesetze und die Rechte anderer.
            Platzieren Sie Sticker nur dort, wo Sie die Erlaubnis dazu haben.
            Seien Sie kreativ, aber seien Sie auch verantwortungsbewusst und
            respektvoll.
          </>
        );
      case "Impressum":
        return (
          <>
            <h3>Unternehmensinformationen:</h3>
            Firma: Astroboy.Media
            <br />
            Adresse: Goldiwilstrasse 8a, 3600 Thun
            <br />
            Telefon: +41 79 123 93 25
            <br />
            E-Mail: info@astroboy.media
            <br />
            <br />
            <h3>Vertretungsberechtigte Personen:</h3>
            Max Schweller, Geschäftsführer <br /> Thierry Jordi, Geschäftsführer
            <br />
            <br />
            <h3>Verantwortlich für den Inhalt:</h3>
            Max Schweller, Geschäftsführer <br />
            Thierry Jordi, Geschäftsführer
          </>
        );

      case "AGB's/ Nutzerbedingungen":
        return (
          <>
            <h2>1. Einleitung</h2>
            Stickerfinder.ch ist ein Produkt von Astroboy Media. Durch die
            Nutzung unserer Plattform akzeptieren Sie diese Allgemeinen
            Geschäftsbedingungen (AGB). Bitte lesen Sie diese sorgfältig durch.
            <br />
            <br />
            <h2>2. Inhalte</h2>
            Alle Inhalte, die auf Stickerfinder.ch veröffentlicht werden, können
            von Astroboy Media und seinen Produkten für kommerzielle Zwecke
            verwendet werden. Mit der Veröffentlichung von Inhalten auf unserer
            Plattform gewähren Sie Astroboy Media ein nicht-exklusives,
            weltweites, lizenzfreies Recht zur Nutzung, Vervielfältigung,
            Anzeige und Verbreitung dieser Inhalte.
            <br />
            <br />
            <h2>3. Datenschutz</h2>
            Wir speichern keine benutzerbezogenen Daten längerfristig. Alle
            gesammelten Daten werden ausschließlich zur Übermittlung und
            korrekten Nutzung der Plattform verwendet. Weitere Informationen
            finden Sie in unserer Datenschutzerklärung.
            <br />
            <br />
            <h2>4. Rechte</h2>
            Alle Rechte an der Plattform und ihren Inhalten liegen bei Astroboy
            Media. Jegliche Nutzung der Inhalte, die nicht ausdrücklich in
            diesen AGB erlaubt ist, bedarf der vorherigen schriftlichen
            Zustimmung von Astroboy Media.
            <br />
            <br />
            <h2>5. Änderungen der AGB</h2>
            Astroboy Media behält sich das Recht vor, diese AGB jederzeit zu
            ändern. Die fortgesetzte Nutzung der Plattform nach solchen
            Änderungen stellt Ihre Zustimmung zu den neuen Bedingungen dar.
            <br />
            <br />
            Durch die Nutzung von Stickerfinder.ch erklären Sie sich mit diesen
            AGB einverstanden. Wenn Sie diesen Bedingungen nicht zustimmen,
            dürfen Sie die Plattform nicht nutzen.
            <br />
            <br />
            Bei Fragen zu unseren Bedingungen können Sie uns gerne kontaktieren.
          </>
        );
      case "Datenschutzerklärung":
        return (
          <>
            <h2>1. Einleitung</h2>
            Bei der Nutzung unserer Plattform Stickerfinder.ch, einem Produkt
            von Astroboy Media, können wir bestimmte Daten erheben. Diese
            Datenschutzerklärung erläutert, welche Daten wir erheben, wie wir
            sie verwenden und wie wir sie schützen.
            <br />
            <br />
            <h2>2. Datenerhebung</h2>
            Mit Ihrer Zustimmung können wir Standortdaten und Bilder von Ihrem
            Gerät erfassen. Diese Daten werden ausschließlich zur Verbesserung
            Ihrer Nutzererfahrung auf unserer Plattform verwendet.
            <br />
            <br />
            <h2>3. Datenspeicherung</h2>
            Alle erfassten Daten werden in unserer Datenbank gespeichert. Bitte
            beachten Sie, dass wir keine personenbezogenen Daten speichern. Die
            Daten, die wir sammeln, sind vollständig anonym und können nicht
            dazu verwendet werden, Sie persönlich zu identifizieren.
            <br />
            <br />
            <h2>4. Datensicherheit</h2>
            Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein,
            um Ihre Daten gegen Verlust, Zerstörung, Zugriff, Veränderung oder
            Verbreitung durch unbefugte Personen zu schützen.
            <br />
            <br />
            <h2>5. Änderungen der Datenschutzerklärung</h2>
            Astroboy Media behält sich das Recht vor, diese Datenschutzerklärung
            jederzeit zu ändern. Die fortgesetzte Nutzung der Plattform nach
            solchen Änderungen stellt Ihre Zustimmung zu den neuen Bedingungen
            dar.
            <br />
            <br />
            Durch die Nutzung von Stickerfinder.ch erklären Sie sich mit dieser
            Datenschutzerklärung einverstanden. Wenn Sie diesen Bedingungen
            nicht zustimmen, dürfen Sie die Plattform nicht nutzen.
            <br />
            <br />
            Bei Fragen zu unserer Datenschutzerklärung können Sie uns gerne
            kontaktieren.
          </>
        );

      case "KAPKAN!":
        return (
          <>
            KAPKAN! ist ein eigenes in der Schweiz entwickeltes Kartenspiel, das
            sich darauf konzentriert, Mensch und Orte zu verbinden. Das Spiel
            ist einfach zu erlernen und bietet, durch eine Vielzahl von
            Spielmodi, eine grosse Auswahl an Spass.
            <br />
            <br />
            Besuchen Sie die KAPKAN! Seite, um mehr zu erfahren und die neuesten
            KAPKAN! Sticker und Projekte zu entdecken. www.kapkan.ch
          </>
        );
      default:
        return (
          <>
            Diese Seite ist derzeit in Bearbeitung. Bitte schauen Sie später
            noch einmal vorbei für mehr Informationen.
          </>
        );
    }
  };
  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "hsl(250, 84%, 54%)" }}>
        <Toolbar>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            <Typography variant="h6" noWrap>
              StickerFinder
            </Typography>
          </Link>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ ml: "auto" }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Drawer open={open} anchor="right" onClose={handleDrawerClose}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() =>
                  typeof item === "string" ? handleDialogOpen(item) : null
                }
              >
                {typeof item === "string" ? (
                  <ListItemText primary={item} />
                ) : (
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="#000"
                    sx={{ textDecoration: "none" }}
                  >
                    <IconButton>{item.icon}</IconButton>
                    {item.text}
                  </Link>
                )}
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>{selectedItem}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {getDialogContent(selectedItem)}{" "}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </AppBar>
      <TotalMarkerBanner
        className="Banner"
        totalMarkers={markerCount}
        newMarkers={newMarkers}
      />
    </div>
  );
};

export default Header;
