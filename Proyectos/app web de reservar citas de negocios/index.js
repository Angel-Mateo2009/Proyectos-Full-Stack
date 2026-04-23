const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notificarNuevaCita = functions.firestore
.document("artifacts/{appId}/public/data/citas/{citaId}")
.onCreate(async (snap, context) => {

    const data = snap.data();

    const payload = {
        notification: {
            title: "Nueva cita en TEO MOTORS",
            body: `${data.nombre} agendó para ${data.fecha} a las ${data.hora}`,
            icon: "icono.png"
        }
    };

    const token = "";

    return admin.messaging().sendToDevice(token, payload);

});