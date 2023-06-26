import { styled } from "@mui/system";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
} from "@mui/material";

export const StyledDialogTitle = styled(DialogTitle)(
  ({ theme, selectedfile, allFieldsFilled }) => ({
    textAlign: "center",
    color: "#fff",
    backgroundColor: selectedfile ? "#4caf50" : "#f44336", // green or red
  })
);

export const StyledDialogTitleEnd = styled(({ data, ...other }) => (
  <DialogTitle {...other} />
))(({ theme, data }) => ({
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4caf50",
}));

export const StyledDialogContent = styled(DialogContent)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const StyledDialogActions = styled(DialogActions)({
  justifyContent: "center",
});

export const StyledButton = styled(Button)(({ theme }) => ({
  margin: "8px",
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  fontSize: "large",
}));
