const prisma = require("../util/db");
const response = require("../util/response");
const { Reservation_status } = require("../util/constants")

exports.getAllReservation = async (req, res) => {
    const reservations = await prisma.reservation.findMany({
        include: {
            chalet: true
        }
    });

    response(res, "tous les reservations", reservations);
}


exports.addReservation = async (req, res) => {

    const reservation = await prisma.reservation.create({
        data: {
            date_debut: new Date(req.body.date_debut),
            date_fin: new Date(req.body.date_fin),
            cout: req.body.cout,
            status: Reservation_status.attente,
            remarque: req.body.remarque,
            chalet_code: req.body.chalet_code
        }
    });

    req.body.clients.forEach(client => {
        client.code_res = reservation.code;
    })

    const requests = req.body.clients.map(client => {
        return prisma.client.create({
            data: client
        })
    });

    await Promise.all(requests);

    response(res, "reservation crée", reservation);
}


exports.getReservation = async (req, res) => {
    const reservation = await prisma.reservation.findFirst({
        where: {
            code: parseInt(req.params.code)
        },
        include: {
            chalet: true
        }
    });


    const clients = await prisma.client.findMany({
        where: {
            code_res: reservation.code
        }
    });

    reservation.clients = clients;

    response(res, "reservation trouvée", reservation);
}


exports.updateReservation = async (req, res) => {
    const reservation = await prisma.reservation.update({
        where: {
            code: parseInt(req.params.code)
        },
        data: {
            date_debut: new Date(req.body.date_debut),
            date_fin: new Date(req.body.date_fin),
            cout: req.body.cout,
            status: req.body.status,
            remarque: req.body.remarque,
            chalet_code: req.body.chalet_code
        }
    });



    const clients = await prisma.client.findMany({
        where: {
            code_res: reservation.code
        }
    });

    reservation.clients = clients;

    response(res, "reservation modifiée", reservation);
}