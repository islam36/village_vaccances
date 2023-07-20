import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stock from "./components/Stock";
import Reservation from "./components/Reservation";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

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

function App() {


  return (
    <>
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar variant="regular">
            {links.map((link) => {
              return (
                <Link key={link.url} to={link.url} className="link" >
                  <Typography variant="h6" sx={{ mr: "60px" }}>
                    {link.title}
                  </Typography>
                </Link>
              );
            })}
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/stock/*" element={<Stock/>} />
          <Route path="/reservations/*" element={<Reservation/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
