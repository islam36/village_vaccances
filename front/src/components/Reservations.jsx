import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
import Tooltip from '@mui/material/Tooltip';

function CustomToolBar({ onClick }) {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
      {/* <Button startIcon={<AddIcon />} onClick={onClick}>
        ajouter
      </Button> */}
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
        <DialogContentText>Ête-vous de vouloir supprimer cette reservation ?</DialogContentText>
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
        <Button onClick={handleAdd(form, setForm, initialState)}>
          ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Reservations() {
  const [rows, setRows] = useState([]);
  const [chalets, setChalets] = useState([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [deleteResCode, setDeleteResCode] = useState(null);


  const modifierStatusReservation = (code, status) => async () => {
    try {
      const request = await fetch(`${BACKEND_URL}/reservation/status/${code}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      const response = await request.json();
      console.log("reservation modifiée:", response);
      getAllReservations();
    } catch (err) {
      console.log(err);
      setErrorText(err.message);
      setErrorDialogOpen(true);
    }
  }


  const deleteReservation = (code) => async () => {
    try {
      const request = await fetch(`${BACKEND_URL}/reservation/${code}`, {
        method: "DELETE",
      });

      const response = await request.json();
      console.log("reservation supprimée:", response);
      getAllReservations();
      setConfirmDialogOpen(false);
    } catch (err) {
      console.log(err);
      setErrorText(err.message);
      setErrorDialogOpen(true);
    }
  }



  const columns = [
    {
      field: "code",
      headerName: "code",
      editable: false,
      type: "number",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "nom",
      headerName: "nom",
      editable: false,
      type: "string",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "date_debut",
      headerName: "date début",
      editable: false,
      width: 100,
      align: "left",
      headerAlign: "left",
      type: "date",
      valueGetter: (params) => new Date(params.row.date_debut),
      renderCell: (params) => (
        <>{params.row.date_debut.toString().slice(0, 10)}</>
      ),
    },
    {
      field: "date_fin",
      headerName: "date fin",
      editable: false,
      type: "date",
      width: 100,
      align: "left",
      headerAlign: "left",
      valueGetter: (params) => new Date(params.row.date_fin),
      renderCell: (params) => (
        <>{params.row.date_fin.toString().slice(0, 10)}</>
      ),
    },
    {
      field: "cout",
      headerName: "coût",
      editable: false,
      type: "number",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "status",
      headerName: "status",
      editable: false,
      type: "string",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "remarque",
      headerName: "remarque",
      editable: false,
      type: "string",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "chalet_code",
      headerName: "chalet",
      editable: false,
      type: "string",
      width: 100,
      align: "left",
      headerAlign: "left",
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
            icon={<Tooltip title="supprimer" ><DeleteIcon /></Tooltip>}
            key="supprimer"
            onClick={() => {
              setDeleteResCode(params.row.code);
              setConfirmDialogOpen(true);
            }}
          />,
        ];

        if (params.row.status === "en attente") {
          list.push(
            <GridActionsCellItem
              label="valider"
              icon={<Tooltip title="valider" ><CheckCircleIcon /> </Tooltip>}
              key="valider"
              onClick={modifierStatusReservation(params.row.code, "validée")}
            />
          );
        } else if (params.row.status === "validée") {
          list.push(
            <GridActionsCellItem
              label="terminer"
              icon={<Tooltip title="terminer"><CheckCircleIcon /> </Tooltip>}
              key="terminer"
              onClick={modifierStatusReservation(params.row.code, "terminée")}
            />
          );
        }

        return list;
      },
    },
  ];

  async function getAllReservations() {
    try {
      const request = await fetch(`${BACKEND_URL}/reservation`);
      const response = await request.json();
      console.log("reservations:", response);
      setRows(response.data);
    } catch (err) {
      console.log(err);
      setErrorText(err.message);
      setErrorDialogOpen(true);
    }
  }

  async function getAllChalets() {
    try {
      const request = await fetch(`${BACKEND_URL}/chalet`);
      const response = await request.json();
      console.log("chalets:", response);
      setChalets(response.data);
    } catch (err) {
      console.log(err);
      setErrorText(err.message);
      setErrorDialogOpen(true);
    }
  }

  const addReservation = (form, setForm, initialState) => async (e) => {
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
    getAllReservations();
  }, []);

  return (
    <>
      <ErrorDialog
        open={errorDialogOpen}
        setOpen={setErrorDialogOpen}
        text={errorText}
      />

      <AddDialog
        open={addDialogOpen}
        setOpen={setAddDialogOpen}
        handleAdd={addReservation}
      />

      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        handleDelete={deleteReservation(deleteResCode)}
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
        getRowId={(row) => row.code}
        disableRowSelectionOnClick
        autoHeight
        density="compact"
        disableColumnMenu
        localeText={{
          toolbarExport: "Exporter",
          toolbarExportLabel: "Exporter",
          toolbarExportCSV: "Télécharger CSV",
          toolbarExportPrint: "Imprimer",
          noRowsLabel: "aucune reservation",
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
