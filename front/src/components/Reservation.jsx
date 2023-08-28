import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { useNavigate, Routes, Route } from "react-router-dom";

import Chalets from "./Chalets";

const links = [
  {
    title: "Chalets",
    url: "chalets",
    element: <Chalets />,
  },
  {
    title: "Reservations",
    url: "reservations",
    element: <div>reservations</div>,
  },
];

export default function Reservation() {
    const navigate = useNavigate();

    const onClick = (url) => () => {
        navigate(url);
    }

  return (
    <>
      <Stack direction="column">
        <Paper sx={{ mt: "10px" }} >
          <Stack direction="row">
            <ButtonGroup variant="text" sx={{ ml: "30px" }} >
              {links.map((link) => (
                <Button key={link.url} onClick={onClick(link.url)} >
                    {link.title}
                </Button>
              ))}
            </ButtonGroup>
          </Stack>
        </Paper>

        <Routes>
              {links.map((link) => (
                <Route key={link.url} path={link.url} element={link.element} />
              ))}    
        </Routes>
      </Stack>
    </>
  );
}
