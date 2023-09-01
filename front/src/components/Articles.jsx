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
import Tooltip from "@mui/material/Tooltip";
import { Typography } from "@mui/material";

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
        <DialogContentText>
          La suppression de cet article va supprimer tous les entrées et les
          sorties qui concerne cet article. Etes-vous sûr de vouloir supprimer
          cet article ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>annuler</Button>
        <Button onClick={handleDelete}>supprimer</Button>
      </DialogActions>
    </Dialog>
  );
}

function AddDialog({ open, setOpen, handleAdd, categories }) {
  const [form, setForm] = useState({
    nom: "",
    stock: 0,
    categorie_code: 1,
    limite: 1,
  });

  const onChange = (e) => {
    if (
      (e.target.name === "stock" || e.target.name === "limite") &&
      e.target.value < 0
    )
      return;

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
      limite: 1,
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
            label="quantité minimale limite"
            name="limite"
            variant="filled"
            type="number"
            value={form.limite}
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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteArticleCode, setDeleteArticleCode] = useState(null);
  const [errorText, setErrorText] = useState("");

  const deleteArticle = async () => {
    try {
      const request = await fetch(
        `${BACKEND_URL}/article/${deleteArticleCode}`,
        {
          method: "DELETE",
        }
      );

      if (!request.ok) {
        throw new Error("Il y avait une erreur!");
      }

      const response = await request.json();
      console.log("delete response", response);
      setRows((oldRows) =>
        oldRows.filter((row) => row.code !== deleteArticleCode)
      );
      setConfirmDialogOpen(false);
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
      headerName: "quantité actuelle en stock",
      editable: false,
      type: "number",
      width: 200,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Typography
          variant="inherit"
          component="span"
          color={params.row.stock <= params.row.limite ? "erorr" : "inherit"}
        >
          {params.row.stock}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "status",
      editable: false,
      type: "string",
      width: 150,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Typography
          variant="inherit"
          component="span"
          sx={{color: params.row.stock <= params.row.limite ? "#d32f2f" : "#4caf50"}}
        >
          {params.row.stock <= params.row.limite ? "en rupture de stock" : "disponible"}
        </Typography>
      ),
    },
    // {
    //   field: "limite",
    //   headerName: "quantité minimale limite",
    //   editable: false,
    //   type: "number",
    //   width: 100,
    //   align: "left",
    //   headerAlign: "left",
    // },
    {
      field: "actions",
      type: "actions",
      width: 100,
      headerName: "opérations",
      getActions: (params) => [
        <GridActionsCellItem
          key={"supprimer"}
          icon={
            <Tooltip title="supprimer">
              <DeleteIcon />
            </Tooltip>
          }
          label="supprimer"
          onClick={() => {
            setDeleteArticleCode(params.id);
            setConfirmDialogOpen(true);
          }}
        />,
      ],
    },
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
      if (newArticle.nom == "") {
        throw new Error("Il faut remplir tous les champs");
      }

      console.log("new article", newArticle);
      const request = await fetch(`${BACKEND_URL}/article`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArticle),
      });

      const response = await request.json();
      console.log("new article", response);
      setRows((old) => [...old, response.data]);

      setAddDialogOpen(false);
      setForm({
        nom: "",
        stock: 0,
        categorie_code: 1,
        limite: 1,
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

      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        handleDelete={deleteArticle}
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
          noRowsLabel: "aucun article",
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
