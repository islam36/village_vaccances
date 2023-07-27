import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    GridActionsCellItem,
  } from "@mui/x-data-grid";
  import AddIcon from "@mui/icons-material/Add";
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
  
  function AddDialog({ open, setOpen, articles, handleAddEntree }) {
    const [form, setForm] = useState({
      article_code: 1,
      date: new Date(),
      quantite: 0,
      prix_unitaire: 0,
      cout_supp: 0,
      fournisseur: "",
      remarque: "",
    });
  
    const numberValues = ["quantite", "prix_unitaire", "cout_supp"];
  
    const onChange = (e) => {
      if (numberValues.includes(e.target.name) && e.target.value < 0) return;
  
      const newValue = numberValues.includes(e.target.name) ? parseFloat(e.target.value) : e.target.value;
  
      setForm((old) => ({
        ...old,
        [e.target.name]:  newValue,
      }));
  
    };
  
    const handleCancel = () => {
      setForm({
        article_code: 1,
        date: new Date(),
        quantite: 0,
        prix_unitaire: 0,
        cout_supp: 0,
        fournisseur: "",
        remarque: "",
      });
      setOpen(false);
    };
  
    return (
      <Dialog open={open}>
        <DialogTitle>Ajouter une nouvelle sortie</DialogTitle>
        <DialogContent>
          <Stack direction="column" sx={{ gap: "20px" }}>
            <TextField
              label="article"
              name="article_code"
              variant="filled"
              value={form.article_code}
              onChange={onChange}
              select
            >
              {articles.map((item) => (
                <MenuItem key={item.code} value={item.code}>
                  {item.nom}
                </MenuItem>
              ))}
            </TextField>
  
            <TextField
              label="date"
              name="date"
              variant="filled"
              type="date"
              value={form.date}
              onChange={onChange}
            />
  
            <TextField
              label="quantité"
              name="quantite"
              variant="filled"
              type="number"
              value={form.quantite}
              onChange={onChange}
            />
  
            <TextField
              label="remarque"
              name="remarque"
              variant="filled"
              type="text"
              value={form.remarque}
              onChange={onChange}
            />
          </Stack>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={handleCancel}>annuler</Button>
          <Button onClick={handleAddEntree(form, setForm)} >ajouter</Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  export default function Sorties() {
    const [articles, setArticles] = useState([]);
    const [rows, setRows] = useState([]);
    const [displayedRows, setDisplayedRows] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [errorText, setErrorText] = useState("");
  
    const columns = [
      {
        field: "sortie_code",
        headerName: "code",
        editable: false,
        type: "number",
        width: 100,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "article",
        headerName: "article",
        editable: false,
        type: "singleSelect",
        width: 100,
        align: "left",
        headerAlign: "left",
        valueGetter: (params) => params.row.article_code,
        renderCell: (params) => <>{params.row.article.nom}</>,
        valueOptions: articles.map((item) => ({
          label: item.nom,
          value: item.code,
        })),
      },
      {
        field: "date",
        headerName: "date",
        editable: false,
        type: "date",
        width: 100,
        align: "left",
        headerAlign: "left",
        valueGetter: (params) => new Date(params.row.date),
        renderCell: (params) => <>{params.row.date.toString().slice(0, 10)}</>
      },
      {
        field: "quantite",
        headerName: "quantité",
        editable: false,
        type: "number",
        width: 100,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "remarque",
        headerName: "remarque",
        editable: false,
        type: "string",
        width: 200,
        align: "left",
        headerAlign: "left",
      },
    ];
  
    async function getAllArticles() {
      try {
        const request = await fetch(`${BACKEND_URL}/article`);
        const response = await request.json();
        console.log("articles:", response);
        setArticles(response.data);
      } catch (err) {
        console.log(err);
        setErrorText(err.message);
        setErrorDialogOpen(true);
      }
    }
  
    async function getAllSorties() {
      try {
        const request = await fetch(`${BACKEND_URL}/sortie`);
        const response = await request.json();
        console.log("sorties:", response);
        setRows(response.data);
        setDisplayedRows(response.data);
      } catch (err) {
        console.log(err);
        setErrorText(err.message);
        setErrorDialogOpen(true);
      }
    }
  
    const handleAddSortie = (form, setForm) => async () => {
      try {
        const values = {
          quantite: 0,
        };
  
        Object.keys(values).forEach(key => {
          if(form[key] === values[key]) {
              throw new Error("Il faut remplir tout les champs");
          }
        });
  
        console.log("new article", form);
        const request = await fetch(`${BACKEND_URL}/sortie`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
  
        const response = await request.json();
        console.log("new sortie", response);
        setRows((old) => [...old, response.data]);
        setDisplayedRows((old) => [...old, response.data]);
  
        setAddDialogOpen(false);
        setForm({
          article_code: 1,
          date: new Date(),
          quantite: 0,
          remarque: "",        
        });
  
      } catch (err) {
        console.log(err);
        setErrorText(err.message);
        setErrorDialogOpen(true);
      }
    };
  
    const handleClickAddBtn = () => {
      setAddDialogOpen(true);
    };
  
    useEffect(() => {
      getAllArticles();
      getAllSorties();
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
          articles={articles}
          handleAddEntree={handleAddSortie}
        />
  
        <DataGrid
          sx={{
            m: "20px",
            "@media print": {
              ".MuiDataGrid-toolbarContainer *": { display: "none" },
            },
          }}
          columns={columns}
          rows={displayedRows}
          getRowId={(row) => row.sortie_code}
          disableRowSelectionOnClick
          autoHeight
          density="compact"
          disableColumnMenu
          localeText={{
            toolbarExport: "Exporter",
            toolbarExportLabel: "Exporter",
            toolbarExportCSV: "Télécharger CSV",
            toolbarExportPrint: "Imprimer",
            noRowsLabel: 'aucune sortie',
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
  