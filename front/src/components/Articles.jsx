import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { BACKEND_URL  } from "../util/constants";



export default function Articles() {
    const [rows, setRows] = useState([]);
    const [categories, setCategories] = useState([]);

    const columns = [
        {
            field: "code",
            headerName: "code",
            editable: false,
            type: "number",
            flex: 1,
            align: "right"
        },
        {
            field: "nom",
            headerName: "nom",
            editable: true,
            type: "string",
            flex: 1,
        },
        {
            field: "categorie",
            headerName: "catégorie",
            editable: true,
            flex: 1,
            valueGetter: (params) => params.row.categorie_code,
            renderCell: (params) => (<>{params.row.categorie.nom_categorie}</>),
            type: "singleSelect",
            valueOptions: categories.map(item => ({ label: item.nom_categorie, value: item.code }))
        },
        {
            field: "stock",
            headerName: "stock",
            editable: false,
            type: "number",
            flex: 1,
        },
    
    ];


    async function getAllCategories() {
        try {
            const request = await fetch(`${BACKEND_URL}/categorie`);
            const response = await request.json();
            console.log("categories:", response);
            setCategories(response.data);
        } catch(err) {
            console.log(err);
        }
    }
    


    async function getAllArticles() {
        try {
            const request = await fetch(`${BACKEND_URL}/article`);
            const response = await request.json();
            console.log("articles:", response);
            setRows(response.data);

        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllCategories();
        getAllArticles();
    }, []);

    return (
        <>
            <DataGrid
                sx={{ m: "20px" }}
                columns={columns}
                rows={rows}
                getRowId={(row) => row.code}
                disableRowSelectionOnClick
                disableColumnMenu
            />
        </>
    );
}