import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ReserverIcon from "@mui/icons-material/EventAvailable";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../util/constants";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

function CustomToolBar({ onClick }) {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
      <Button startIcon={<AddIcon />} onClick={onClick}>
        ajouter
      </Button>
    </GridToolbarContainer>
  );
}

function ErrorDialog({ open, setOpen, text }) {
  const handleClick = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Erreur</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClick}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

function ConfirmDeleteDialog({ open, setOpen, handleDelete }) {
  const close = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>La suppression de ce chalet ?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>annuler</Button>
        <Button onClick={handleDelete}>supprimer</Button>
      </DialogActions>
    </Dialog>
  );
}

function AddDialog({ open, setOpen, handleAdd }) {
  const initialState = {
    numero: "",
    type: "studio",
    cout: 0,
  };

  const types = ["studio", "F2", "F3"];

  const [form, setForm] = useState(initialState);

  const onChange = (e) => {
    if (e.target.name === "cout" && e.target.value < 0) return;

    setForm((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCancel = () => {
    setForm(initialState);
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Ajouter un nouveau chalet</DialogTitle>
      <DialogContent>
        <Stack direction="column" sx={{ gap: "20px" }}>
          <TextField
            label="numéro"
            name="numero"
            variant="filled"
            value={form.numero}
            onChange={onChange}
          />

          <TextField
            label="type"
            name="type"
            variant="filled"
            value={form.type}
            onChange={onChange}
            select
          >
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="coût"
            name="cout"
            variant="filled"
            value={form.cout}
            onChange={onChange}
            type="number"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>annuler</Button>
        <Button onClick={handleAdd(form, setForm, initialState)} >ajouter</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Chalets() {
  const [rows, setRows] = useState([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [errorText, setErrorText] = useState("");

  const columns = [
    {
      field: "numero",
      headerName: "numéro",
      editable: false,
      type: "string",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "type",
      headerName: "type",
      editable: false,
      type: "singleSelect",
      width: 200,
      align: "left",
      headerAlign: "left",
      valueOptions: ["studio", "F2", "F3"],
    },
    {
      field: "cout",
      headerName: "coût",
      editable: false,
      width: 200,
      align: "left",
      headerAlign: "left",
      type: "number",
    },
    {
      field: "status",
      headerName: "status",
      editable: false,
      type: "singleSelect",
      width: 100,
      align: "left",
      headerAlign: "left",
      valueOptions: ["libre", "occupé"],
    },
    {
      field: "actions",
      type: "actions",
      width: 100,
      headerName: "opérations",
      getActions: (params) => {
        const list = [
          <GridActionsCellItem
            label="supprimer"
            icon={<DeleteIcon />}
            key="supprimer"
          />,
        ];

        if (params.row.status === "libre") {
          list.push(
            <GridActionsCellItem
              label="reserver"
              icon={<ReserverIcon />}
              key="reserver"
            />
          );
        }

        return list;
      },
    },
  ];

  async function getAllChalets() {
    try {
      const request = await fetch(`${BACKEND_URL}/chalet`);
      const response = await request.json();
      console.log("chalets:", response);
      setRows(response.data);
    } catch (err) {
      console.log(err);
      setErrorText(err.message);
      setErrorDialogOpen(true);
    }
  }

  const addChalet = (form, setForm, initialState) => async (e) => {
    try {
      if (form.numero.length < 1 || form.cout < 1) {
        throw new Error("Il faut remplir tout les champs");
      }

      const request = await fetch(`${BACKEND_URL}/chalet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const response = await request.json();

      console.log("new chalet:", response);
      setRows((old) => [...old, response.data]);

      setForm(initialState);
      setAddDialogOpen(false);
    } catch (err) {
      console.log(err);
      setErrorText(err.message);
      setErrorDialogOpen(true);
    }
  };

  function handleClickAddBtn() {
    setAddDialogOpen(true);
  }

  useEffect(() => {
    getAllChalets();
  }, []);

  return (
    <>
      <ErrorDialog
        open={errorDialogOpen}
        setOpen={setErrorDialogOpen}
        text={errorText}
      />

      <AddDialog open={addDialogOpen} setOpen={setAddDialogOpen} handleAdd={addChalet} />

      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
      />

      <DataGrid
        sx={{
          m: "20px",
          "@media print": {
            ".MuiDataGrid-toolbarContainer *": { display: "none" },
          },
        }}
        columns={columns}
        rows={rows}
        getRowId={(row) => row.numero}
        disableRowSelectionOnClick
        autoHeight
        density="compact"
        disableColumnMenu
        localeText={{
          toolbarExport: "Exporter",
          toolbarExportLabel: "Exporter",
          toolbarExportCSV: "Télécharger CSV",
          toolbarExportPrint: "Imprimer",
          noRowsLabel: "aucun chalet",
        }}
        slots={{
          toolbar: CustomToolBar,
        }}
        slotProps={{
          toolbar: {
            onClick: handleClickAddBtn,
          },
        }}
      />
    </>
  );
}
