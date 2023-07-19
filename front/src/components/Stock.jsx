import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Articles from "./Articles";
import { useNavigate, Routes, Route } from "react-router-dom";

const links = [
  {
    title: "articles",
    url: "articles",
    element: <Articles />,
  },
  {
    title: "entrées",
    url: "entrees",
    element: <div>entrees</div>,
  },
  {
    title: "sorties",
    url: "sorties",
    element: <div>sorties</div>,
  },
];

export default function Stock() {
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
