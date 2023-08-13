const prisma = require("../util/db");
const response = require("../util/response");


exports.getAllSortie = async (req, res) => {
    const sorties = await prisma.sortie.findMany({
        include: {
            article: true
        }
    });

    response(res, "tous les sortie", sorties);
}


exports.addSortie = async (req, res) => {

    await prisma.$executeRaw`update Article set stock = stock - ${req.body.quantite} where code = ${req.body.article_code}`;


    const sortie = await prisma.sortie.create({
        data: {
            article_code: req.body.article_code,
            date: new Date(req.body.date),
            quantite: req.body.quantite,
            remarque: req.body.remarque
        },
        include: {
            article: true
        }
    });

    response(res, "sortie créée", sortie);
}


exports.deleteSortie = async (req, res) => {
    await prisma.$executeRaw`delete from sortie where sortie_code = ${req.params.code}`;
  
    response(res, "sortie supprimée", null);
  }