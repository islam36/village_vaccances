import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stock from "./components/Stock";
import Reservation from "./components/Reservation";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useRef, useState } from "react";


const links = [
  {
    title: "gestion stock",
    url: "stock",
  },
  {
    title: "gestion reservation",
    url: "reservations",
  },
];

const SECRET = "AJY7N-MK27Q-P4UFZ";

function App() {
  const secret = localStorage.getItem("secret");
  const inputRef = useRef();
  const [text, setText] = useState("");

  if(secret == null || secret != SECRET) {

    const onClick = () => {
      if(inputRef.current.value === SECRET) {
        localStorage.setItem("secret", inputRef.current.value);
        location.reload();
      } else {
        setText("code non valide");
      }
    }

    return (
      <Paper elevation={4} sx={{ width: "400px", mx: "auto", mt: "100px", p: "20px" }} >
        <Stack direction="column" sx={{ gap: "20px" }} >
          <Typography>Veiller entrer le code secret du logiciel:</Typography>
          <TextField
            inputRef={inputRef}
            helperText={text}
            FormHelperTextProps={{ sx: { color: "red"} }}
          />
          <Button onClick={onClick} variant="contained" >confimer</Button>
        </Stack>
      </Paper>
    );
  }
  

  return (
    <>
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar variant="regular">
            {links.map((link) => {
              return (
                <Link key={link.url} to={link.url} className="link">
                  <Typography variant="h6" sx={{ mr: "60px" }}>
                    {link.title}
                  </Typography>
                </Link>
              );
            })}
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/stock/*" element={<Stock />} />
          <Route path="/reservations/*" element={<Reservation />} />
          <Route path="/" element={<Navigate to="/stock" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
