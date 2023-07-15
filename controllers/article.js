const prisma = require("../util/db");
const response = require("../util/response");

exports.getAllArticles = async (req, res) => {
    const articles = await prisma.article.findMany({
        include: {
            categorie: true
        }
    })

    response(res, "tous les articles", articles);
}


exports.addArticle = async (req, res) => {
    const article = await prisma.article.create({
        data: {
            nom: req.body.nom,
            stock: req.body.stock,
            categorie_code: req.body.categorie_code
        },
        include: {
            categorie: true
        }
    });

    response(res, "article créé", article);
}

exports.updateArticle = async (req, res) => {
    const article = await prisma.article.update({
        where: {
            code: parseInt(req.params.code)
        },
        data: {
            nom: req.body.nom,
            categorie_code: req.body.categorie_code
        },
        include: {
            categorie: true
        }
    });


    response(res, "article modifié", article);
}


exports.deleteArticle = async (req, res) => {
    const nb_entrees = await prisma.entree.count({
        where: {
            article_code: parseInt(req.params.code)
        }
    });

    const nb_sorties = await prisma.sortie.count({
        where: {
            article_code: parseInt(req.params.code)
        }
    });

    if(nb_entrees + nb_sorties > 0) {
        response(res, "Cet article ne peut pas être supprimé car il est associé à des entrées et sorties", null, 400);
        return;
    }


    const article = await prisma.article.delete({
        where: {
            code: parseInt(req.params.code)
        },
        include: {
            categorie: true
        }
    });

    response(res, "article supprimé", article);
}