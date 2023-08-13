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
      cout_supp: req.body.cout_supp,
      quantite: req.body.quantite,
      remarque: req.body.remarque,
      prix_total: req.body.prix_unitaire * req.body.quantite + req.body.cout_supp
    },
    include: {
      article: true,
    },
  });


  response(res, "entrée créée", entree);
};


exports.deleteEntree = async (req, res) => {

  const entree = await prisma.entree.findFirst({
    where: {
      entree_code: parseInt(req.params.code)
    }
  });


  await prisma.$executeRaw`update Article set stock = stock - ${entree.quantite} where code = ${entree.article_code}`;
  await prisma.$executeRaw`delete from entree where entree_code = ${req.params.code}`;

  response(res, "entrée supprimée", null);
}


