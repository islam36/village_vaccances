const prisma = require("../util/db");
const response = require("../util/response");
const { Reservation_status, Chalet_status } = require("../util/constants");

exports.getAllChalet = async (req, res) => {
  const chalets = await prisma.chalet.findMany();


  for(let i = 0; i < chalets.length; i++) {

    const count = await prisma.reservation.count({
        where: {
            chalet_code: chalets[i].numero,
            status: Reservation_status.valide,
        }
    });

    chalets[i].status = (count > 0) ? Chalet_status.occupe : Chalet_status.libre;
  }


  response(res, "tous les chalets", chalets);
};

exports.addChalet = async (req, res) => {
  const chalet = await prisma.chalet.create({
    data: {
      numero: req.body.numero,
      type: req.body.type,
      cout: req.body.cout,
    },
  });

  response(res, "chalet créé", chalet);
};
