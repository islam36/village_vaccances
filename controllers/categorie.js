const prisma = require("../util/db");
const response = require("../util/response")

exports.getAllCategorie = async (req, res) => {
    const categories = await prisma.categorie.findMany();
    response(res, "Tous les catégories", categories);
}


exports.addCategorie = async (req, res) => {
    const categorie = await prisma.categorie.create({
        data: {
            nom_categorie: req.body.nom_categorie
        }
    });

    response(res, "catégorie créée", categorie);
}


exports.updateCategorie = async (req, res) => {
    const categorie = await prisma.categorie.update({
        where: {
            code: parseInt(req.params.code)
        },
        data: {
            nom_categorie: req.body.nom_categorie
        }
    });

    response(res, "categorie modifiée", categorie);
}


exports.deleteCategorie = async (req, res) => {
    const articles = await prisma.article.findMany({
        where: {
            categorie_code: parseInt(req.params.code)
        }
    });

    if(articles.length > 0) {
        response(res, "Il faut supprimer tous les articles avec cette catégorie pour pouvoir supprimer la catégorie");
        return;
    }

    const categorie = await prisma.categorie.delete({
        where: {
            code: parseInt(req.params.code)
        }
    });

    response(res, "categorie supprimée", categorie);
}