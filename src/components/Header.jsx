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
    "Karte",
    "Über uns",
    "AGB's/ Nutzerbedingungen",
    "KAPKAN!",
  ]; // Fügen Sie hier Ihre Menüseiten hinzu

  const getDialogContent = (item) => {
    switch (item) {
      case "Karte":
        return "Willkommen auf der Startseite!";
      case "Über uns":
        return "Hier erfahren Sie mehr über uns.";
      case "AGB's/Nutzerbidungungen":
        return "Hier finden Sie unsere Kontaktdaten.";
      case "KAPKAN!":
        return "Dies ist unsere andere Seite.";
      default:
        return "Noch keine Informationen verfügbar.";
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "hsl(250, 84%, 54%)" }}>
      <Toolbar>
        <Typography variant="h6" component="div">
          Logo
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
