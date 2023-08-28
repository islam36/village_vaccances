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
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from '@mui/material/Tooltip';
import {  Typography } from "@mui/material";

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
        <DialogContentText>La suppression de ce chalet va causer la suppression de toutes les réservations fait pour ce chalet. Voulez-vous supprimer ce chalet ?</DialogContentText>
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

function AddReservationDialog({
  open,
  setOpen,
  handleAddReservation,
  chalet_code,
}) {
  const initialState = {
    nom: "",
    date_debut: null,
    date_fin: null,
    cout: 0,
    remarque: "",
  };

  const clientInitialState = {
    nom: "",
    prenom: "",
    type_piece: "carte identité",
    numero_piece: "",
  };

  const types_pieces = ["carte identité", "passeport", "permis"]

  const [client, setClient] = useState(clientInitialState);

  const [form, setForm] = useState(initialState);
  const [clients, setClients] = useState([]);

  const onChange = (e) => {
    setForm(old => ({
      ...old,
      [e.target.name]: e.target.value 
    }))
  };

  const onChangeClient = (e) => {
      setClient(old => ({
      ...old,
      [e.target.name]: e.target.value 
    }))
  };

  const addClient = () => {
    if(client.nom.length < 1 || client.prenom.length < 1 || client.numero_piece.length < 1) {
      return;
    }

    clients.push(client);
    setClient(clientInitialState);
  }

  const deleteClient = (index) => () => {
    const newClients = [...clients];
    newClients.splice(index, 1);

    setClients(newClients);
  }


  const handleCancel = () => {
    setForm(initialState);
    setClient(clientInitialState);
    setClients([]);
    setOpen(false);
  }


  return (
    <Dialog open={open}>
      <DialogTitle>Ajouter une reservation pour le chalet: {chalet_code}</DialogTitle>
      <DialogContent>
        <Stack direction="column" sx={{ gap: "20px" }}>
          <TextField
            label="nom"
            name="nom"
            variant="filled"
            value={form.nom}
            onChange={onChange}
          />

          <TextField
            label="date début"
            name="date_debut"
            variant="filled"
            value={form.date_debut || ""}
            onChange={onChange}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="date fin"
            name="date_fin"
            variant="filled"
            value={form.date_fin || ""}
            onChange={onChange}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="coût"
            name="cout"
            variant="filled"
            value={form.cout}
            onChange={onChange}
            type="number"
          />

          <TextField
            label="remarque"
            name="nom"
            variant="filled"
            value={form.remarque}
            onChange={onChange}
          />

          <Typography>Liste des clients</Typography>
          <ul>
            {clients.map((client, index) => (
              <li key={index}>
                {`${client.nom}  ${client.prenom} | ${client.type_piece}: ${client.numero_piece}`}
                <IconButton  onClick={deleteClient(index)} >
                  <DeleteIcon color="error" />
                </IconButton>
              </li>
            ))}
          </ul>

          <Stack direction="column" sx={{ gap: "10px" }} >
            <Stack direction="row" sx={{ gap: "10px" }} >
              <TextField
                label="nom"
                name="nom"
                variant="filled"
                value={client.nom}
                onChange={onChangeClient}
              />

              <TextField
                label="prénom"
                name="prenom"
                variant="filled"
                value={client.prenom}
                onChange={onChangeClient}
              />
            </Stack>

            <Stack direction="row" sx={{ gap: "10px" }} >
              <TextField
                label="type pièce"
                name="type_piece"
                variant="filled"
                value={client.type_piece}
                select
                onChange={onChangeClient}
                sx={{ width: "180px" }}
              >
                {
                  types_pieces.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))
                }
              </TextField>

              <TextField
                label="numéro pièce"
                name="numero_piece"
                variant="filled"
                value={client.numero_piece}
                onChange={onChangeClient}
              />
            </Stack>
          </Stack>
          <Button icon={<AddIcon />} onClick={addClient} variant="contained">
            ajouter client
          </Button>

          
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} >annuler</Button>
        <Button onClick={handleAddReservation(form, setForm, initialState, clients, setClients, setClient, clientInitialState)} >ajouter</Button>
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
  const [AddReservationDialogOpen, setAddReservationDialogOpen] = useState(false);
  const [chaletCode, setChaletCode] = useState(null);
  const [chaletDeleteCode, setChaletDeleteCode] = useState(null);

  const deleteChalet = (code) => async () => {
    try {
      const request = await fetch(`${BACKEND_URL}/chalet/${code}`, {
        method: "DELETE",
      });

      const response = await request.json();
      console.log("chalet supprimée:", response);
      getAllChalets();
      setConfirmDialogOpen(false);
    } catch (err) {
      console.log(err);
      setErrorText(err.message);
      setErrorDialogOpen(true);
    }
  }


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
            icon={<Tooltip title="supprimer" ><DeleteIcon /></Tooltip>}
            key="supprimer"
            onClick={() => {
              setChaletDeleteCode(params.row.numero);
              setConfirmDialogOpen(true);
            }}
          />,
        ];

        if (params.row.status === "libre") {
          list.push(
            <GridActionsCellItem
              label="reserver"
              icon={<Tooltip title="réserver" ><ReserverIcon /></Tooltip>}
              key="reserver"
              onClick={() => {
                setChaletCode(params.row.numero);
                setAddReservationDialogOpen(true);
              }}
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


  const addReservation = (form, setForm, initialState, clients, setClients, setClient, clientInitialState) => async () => {
    try {
      if (form.nom.length < 1 || form.cout < 1 || form.date_debut == null || form.date_fin == null || clients.length < 1) {
        throw new Error("Il faut remplir tout les champs");
      }

      const data = {
        ...form,
        chalet_code: chaletCode,
        clients,
      }

      const request = await fetch(`${BACKEND_URL}/reservation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await request.json();

      console.log("new reservation:", response);

      setForm(initialState);
      setClient(clientInitialState);
      setClients([]);
      getAllChalets();
      setAddReservationDialogOpen(false);
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

      <AddDialog
        open={addDialogOpen}
        setOpen={setAddDialogOpen}
        handleAdd={addChalet}
      />

      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        handleDelete={deleteChalet(chaletDeleteCode)}
      />

      <AddReservationDialog
        open={AddReservationDialogOpen}
        setOpen={setAddReservationDialogOpen}
        chalet_code={chaletCode}
        handleAddReservation={addReservation}
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
