const prisma = require("../util/db");
const response = require("../util/response");
const { Reservation_status } = require("../util/constants")

exports.getAllReservation = async (req, res) => {
    const reservations = await prisma.reservation.findMany({
        include: {
            chalet: true,
            Client: true,
        }
    });

    reservations.forEach(r => {
        r.nom = r.Client[0].nom 
    })

    response(res, "tous les reservations", reservations);
}


exports.addReservation = async (req, res) => {

    const reservation = await prisma.reservation.create({
        data: {
            date_debut: new Date(req.body.date_debut),
            date_fin: new Date(req.body.date_fin),
            // nom: req.body.nom,
            cout: parseFloat(req.body.cout),
            status: Reservation_status.attente,
            remarque: req.body.remarque,
            chalet_code: req.body.chalet_code,
            Client: {
                create: [...req.body.clients]
            }
        }
    });

    // req.body.clients.forEach(client => {
    //     client.code_res = reservation.code;
    // })

    // const requests = req.body.clients.map(client => {
    //     return prisma.client.create({
    //         data: client
    //     })
    // });

    // await Promise.all(requests);

    response(res, "reservation crée", reservation);
}


exports.getReservation = async (req, res) => {
    const reservation = await prisma.reservation.findFirst({
        where: {
            code: parseInt(req.params.code)
        },
        include: {
            chalet: true,
            Client: true,
        }
    });


    // const clients = await prisma.client.findMany({
    //     where: {
    //         code_res: reservation.code
    //     }
    // });

    // reservation.clients = clients;

    response(res, "reservation trouvée", reservation);
}


exports.updateReservationStatus = async (req, res) => {
    const reservation = await prisma.reservation.update({
        where: {
            code: parseInt(req.params.code)
        },
        data: {
            status: req.body.status,
        }
    });


    response(res, "reservation modifiée", reservation);
}


exports.deleteReservation = async (req, res) => {
    await prisma.$executeRaw`delete from Client where code_res = ${req.params.code}`;

    const reservation = await prisma.reservation.delete({
        where: {
            code: parseInt(req.params.code)
        }
    });

    response(res, "réservation supprimée", reservation);
}