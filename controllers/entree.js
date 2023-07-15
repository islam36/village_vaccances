const prisma = require("../util/db");
const response = require("../util/response");

exports.getAllEntree = async (req, res) => {
  const entrees = await prisma.entree.findMany({
    include: {
      article: true,
    },
  });

  response(res, "tous les entrées", entrees);
};

exports.addEntree = async (req, res) => {

  await prisma.$executeRaw`update Article set stock = stock + ${req.body.quantite} where code = ${req.body.article_code}`;
  
  const entree = await prisma.entree.create({
    data: {
      article_code: req.body.article_code,
      date: new Date(req.body.date),
      fournisseur: req.body.fournisseur,
      prix_unitaire: req.body.prix_unitaire,
      quantite: req.body.quantite,
      remarque: req.body.remarque,
      prix_total: req.body.prix_total
    },
    include: {
      article: true,
    },
  });


  response(res, "entrée créée", entree);
};


