import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete"
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

function Filters({ articles, onClick, reset }) {
  const [form, setForm] = useState({
    article: Number.MAX_VALUE,
    debut: null,
    fin: null,
  });

  const onChange = (e) => {
    setForm((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }));

    console.log("filter change:", form);
  };


  const resetForm = (e) => {
    reset();

    setForm({
      article: Number.MAX_VALUE,
      debut: null,
      fin: null,
    })
  }

  return (
    <Stack direction="row" sx={{ gap: "15px" }} >
      <TextField
        label="article"
        name="article"
        variant="filled"
        value={form.article}
        onChange={onChange}
        select
      >
        <MenuItem key="" value={Number.MAX_VALUE}>{"<vide>"}</MenuItem>

        {articles.map((item) => (
          <MenuItem key={item.code} value={item.code}>
            {item.nom}
          </MenuItem>
        ))}
      </TextField>

     

      <TextField
        label="date debut"
        name="debut"
        variant="filled"
        value={form.debut || ""}
        onChange={onChange}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        label="date fin"
        name="fin"
        variant="filled"
        value={form.fin || ""}
        onChange={onChange}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button onClick={onClick(form)} >filter</Button>
      <Button onClick={resetForm} >vider</Button>
    </Stack>
  );
}

function CustomToolBar({ onClick, articles, handleFilter, handleReset }) {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
      <Button startIcon={<AddIcon />} onClick={onClick}>
        ajouter
      </Button>

      <Filters articles={articles} onClick={handleFilter} reset={handleReset} />
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

    const newValue = numberValues.includes(e.target.name)
      ? parseFloat(e.target.value)
      : e.target.value;

    setForm((old) => ({
      ...old,
      [e.target.name]: newValue,
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
      <DialogTitle>Ajouter une nouvelle entrée</DialogTitle>
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
            label="prix unitaire"
            name="prix_unitaire"
            variant="filled"
            type="number"
            value={form.prix_unitaire}
            onChange={onChange}
          />

          <TextField
            label="coût supplémentaire"
            name="cout_supp"
            variant="filled"
            type="number"
            value={form.cout_supp}
            onChange={onChange}
          />

          <TextField
            label="fournisseur"
            name="fournisseur"
            variant="filled"
            type="text"
            value={form.fournisseur}
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
        <Button onClick={handleAddEntree(form, setForm)}>ajouter</Button>
      </DialogActions>
    </Dialog>
  );
}

function ConfirmDeleteDialog({ open, setOpen, handleDelete }) {
  const close = () => {
    setOpen(false);
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText> Etes-vous sûr de vouloir supprimer cette entrée ?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>annuler</Button>
        <Button onClick={handleDelete}>supprimer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Entrees() {
  const [articles, setArticles] = useState([]);
  const [rows, setRows] = useState([]);
  const [displayedRows, setDisplayedRows] = useState([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteEntreeCode, setDeleteEntreeCode] = useState(null);

  const columns = [
    {
      field: "entree_code",
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
      renderCell: (params) => <>{params.row.date.toString().slice(0, 10)}</>,
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
      field: "prix_unitaire",
      headerName: "prix unitaire",
      editable: false,
      type: "number",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "cout_supp",
      headerName: "coût supplémentaire",
      editable: false,
      type: "number",
      width: 200,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "prix_total",
      headerName: "coût total",
      editable: false,
      type: "number",
      width: 200,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "fournisseur",
      headerName: "fournisseur",
      editable: false,
      type: "string",
      width: 200,
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
    {
      field: "actions",
      type: "actions",
      width: 100,
      headerName: "opérations",
      getActions: (params) => [
        <GridActionsCellItem
          key={"supprimer"}
          icon={<DeleteIcon />}
          label="supprimer"
          onClick={() => {
            setDeleteEntreeCode(params.id);
            setConfirmDialogOpen(true);
          }}
        />,
      ],
    },
  ];

  const deleteEntree = async () => {
    try {
      const request = await fetch(`${BACKEND_URL}/entree/${deleteEntreeCode}`, {
        method: "DELETE",
      });

      if (!request.ok) {
        throw new Error("Il y avait une erreur!");
      }

      const response = await request.json();
      console.log("delete response", response);
      getAllEntrees();
      setConfirmDialogOpen(false);
    } catch (err) {
      console.log(err);
      setErrorText(err.message);
      setErrorDialogOpen(true);
    }
  };

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

  async function getAllEntrees() {
    try {
      const request = await fetch(`${BACKEND_URL}/entree`);
      const response = await request.json();
      console.log("entress:", response);
      setRows(response.data);
      setDisplayedRows(response.data);
    } catch (err) {
      console.log(err);
      setErrorText(err.message);
      setErrorDialogOpen(true);
    }
  }

  const handleAddEntree = (form, setForm) => async () => {
    try {
      const values = {
        quantite: 0,
        prix_unitaire: 0,
      };

      Object.keys(values).forEach((key) => {
        if (form[key] === values[key]) {
          throw new Error("Il faut remplir tout les champs");
        }
      });

      console.log("new article", form);
      const request = await fetch(`${BACKEND_URL}/entree`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const response = await request.json();
      console.log("new entree", response);
      setRows((old) => [...old, response.data]);
      setDisplayedRows((old) => [...old, response.data]);

      setAddDialogOpen(false);
      setForm({
        article_code: 1,
        date: new Date(),
        quantite: 0,
        prix_unitaire: 0,
        cout_supp: 0,
        fournisseur: "",
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

  const handleReset = (e) => {
    setDisplayedRows(rows);
  }


  const handleFilter = (form) => (e) => {
    const filterRows = rows.filter(row => {
      let article = true, debut = true, fin = true;

      if(form.article !== Number.MAX_VALUE) {
        article = form.article === row.article_code;
      }

      if(form.debut != null) {
        debut = row.date >= form.debut;
      } 

      if(form.fin != null) {
        fin = row.date <= form.fin;
      }


      return article && debut && fin;
    });

    console.log("filtered rows:", filterRows);
    setDisplayedRows(filterRows);
  }

  useEffect(() => {
    getAllArticles();
    getAllEntrees();
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
        handleAddEntree={handleAddEntree}
      />

      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        handleDelete={deleteEntree}
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
        getRowId={(row) => row.entree_code}
        disableRowSelectionOnClick
        autoHeight
        density="compact"
        disableColumnMenu
        localeText={{
          toolbarExport: "Exporter",
          toolbarExportLabel: "Exporter",
          toolbarExportCSV: "Télécharger CSV",
          toolbarExportPrint: "Imprimer",
          noRowsLabel: "aucune entrée",
        }}
        slots={{
          toolbar: CustomToolBar,
        }}
        slotProps={{
          toolbar: {
            onClick: handleClickAddBtn,
            articles: articles,
            handleFilter,
            handleReset,
          },
        }}
      />
    </>
  );
}
