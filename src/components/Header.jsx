import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

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
    "Über uns",
    "AGB's/ Nutzerbedingungen",
    "KAPKAN!",
  ];

  const getDialogContent = (item) => {
    switch (item) {
      case "StickerFinder.ch":
        return (
          <>
            Willkommen zu StickerFinder.ch. <br /> <br /> Hier finden Sie alle
            entdeckten Sticker. Zum aktuellen Zeitpunkt werden nur KAPKAN!
            Sticker unterstützt. Weitere folgen in Kürze.
            <br />
            <br />
            Die Karte zeigt Ihnen alle gefundenen und auf der Plattform
            hochgeladenen Sticker an. Wenn Sie einen Sticker finden, können Sie
            diesen mit dem 'Plus-Button' melden und hochladen.
          </>
        );
      case "Über uns":
        return (
          <>
            Wir sind ein engagiertes Team von Entwicklern, Designern und
            Spielern, die eine Plattform für Stickerliebhaber geschaffen haben.
            Unsere Mission ist es, das Finden und Teilen von Stickern so einfach
            und zugänglich wie möglich zu machen.
            <br />
            <br />
            Wir sind ständig bemüht, unsere Plattform zu verbessern und neue
            Funktionen hinzuzufügen. Wenn Sie Fragen oder Anregungen haben,
            melden sich sich gern unter kontak@kapkan.ch.
          </>
        );
      case "AGB's/ Nutzerbedingungen":
        return (
          <>
            Unsere allgemeinen Geschäftsbedingungen und Nutzerbedingungen finden
            Sie auf unserer Website. Bitte lesen Sie diese sorgfältig durch,
            bevor Sie unsere Plattform nutzen.
            <br />
            <br />
            Bei Fragen zu unseren Bedingungen können Sie uns gerne kontaktieren.
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

  // In Ihrer Dialog-Komponente

  return (
    <AppBar position="static" sx={{ backgroundColor: "hsl(250, 84%, 54%)" }}>
      <Toolbar>
        <Typography variant="h6" component="div">
          Stickerfinder
        </Typography>
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
      <Drawer anchor="right" open={open} onClose={handleDrawerClose}>
        <List>
          {menuItems.map((text, index) => (
            <ListItem button key={text} onClick={() => handleDialogOpen(text)}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{selectedItem}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {getDialogContent(selectedItem)}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};

export default Header;
