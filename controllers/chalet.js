const prisma = require("../util/db");
const response = require("../util/response");
const { Chalet_status } = require("../util/constants")

exports.getAllChalet = async (req, res) => {
    const chalets = await prisma.chalet.findMany();
    response(res, "tous les chalets", chalets);
}


exports.addChalet = async (req, res) => {
    const chalet = await prisma.chalet.create({
        data: {
            numero: req.body.numero,
            type: req.body.type,
            cout: req.body.cout
        }
    });

    response(res, "chalet créé", chalet);
}