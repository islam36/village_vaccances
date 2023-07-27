import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
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

function AddDialog({ open, setOpen, handleAdd, categories }) {
  const [form, setForm] = useState({
    nom: "",
    stock: 0,
    categorie_code: 1,
  });

  const onChange = (e) => {
    if(e.target.name === "stock" && e.target.value < 0) return;

    setForm((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCancel = () => {
    setForm({
      nom: "",
      stock: 0,
      categorie_code: 1,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Ajouter un nouvel article</DialogTitle>
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
            label="stock initial"
            name="stock"
            variant="filled"
            type="number"
            value={form.stock}
            onChange={onChange}
          />

          <TextField
            label="catégorie"
            name="categorie_code"
            variant="filled"
            value={form.categorie_code}
            onChange={onChange}
            select
          >
            {categories.map((item) => (
              <MenuItem key={item.code} value={item.code}>
                {item.nom_categorie}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>annuler</Button>
        <Button onClick={handleAdd(form, setForm)}>ajouter</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Articles() {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [errorText, setErrorText] = useState("");

  const deleteArticle = (code) => async () => {
    try {
      const request = await fetch(`${BACKEND_URL}/article/${code}`, {
        method: "DELETE",
      });

      if (!request.ok) {
        throw new Error("Il y avait une erreur!");
      }

      const response = await request.json();
      console.log("delete response", response);
      setRows((oldRows) => oldRows.filter((row) => row.code !== code));
    } catch (err) {
      console.log(err);
      setErrorText(err.message);
      setErrorDialogOpen(true);
    }
  };

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
      width: 200,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "categorie",
      headerName: "catégorie",
      editable: false,
      width: 200,
      align: "left",
      headerAlign: "left",
      valueGetter: (params) => params.row.categorie_code,
      renderCell: (params) => <>{params.row.categorie.nom_categorie}</>,
      type: "singleSelect",
      valueOptions: categories.map((item) => ({
        label: item.nom_categorie,
        value: item.code,
      })),
    },
    {
      field: "stock",
      headerName: "stock",
      editable: false,
      type: "number",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    // {
    //   field: "actions",
    //   type: "actions",
    //   width: 100,
    //   headerName: "opérations",
    //   getActions: (params) => [
    //     <GridActionsCellItem
    //       key={"supprimer"}
    //       icon={<DeleteIcon />}
    //       label="supprimer"
    //       onClick={deleteArticle(params.id)}
    //     />,
    //   ],
    // },
  ];

  async function getAllCategories() {
    try {
      const request = await fetch(`${BACKEND_URL}/categorie`);
      const response = await request.json();
      console.log("categories:", response);
      setCategories(response.data);
    } catch (err) {
      console.log(err);
      setErrorText(err.message);
      setErrorDialogOpen(true);
    }
  }

  async function getAllArticles() {
    try {
      const request = await fetch(`${BACKEND_URL}/article`);
      const response = await request.json();
      console.log("articles:", response);
      setRows(response.data);
    } catch (err) {
      console.log(err);
      setErrorText(err.message);
      setErrorDialogOpen(true);
    }
  }

  const handleClickAddBtn = () => {
    setAddDialogOpen(true);
  };

  const handleAddArticle = (newArticle, setForm) => async () => {
    try {
      if(newArticle.nom == "") {
        throw new Error("Il faut remplir tous les champs")
      }

      console.log("new article", newArticle);
      const request = await fetch(`${BACKEND_URL}/article`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newArticle),
      });

      const response = await request.json();
      console.log("new article", response);
      setRows(old => [
        ...old,
        response.data
      ]);

      setAddDialogOpen(false);
      setForm({
        nom: "",
        stock: 0,
        categorie_code: 1,
      });
    } catch (err) {
      console.log(err);
      setErrorText(err.message);
      setErrorDialogOpen(true);
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllArticles();
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
        categories={categories}
        handleAdd={handleAddArticle}
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
          noRowsLabel: 'aucun article',
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
