(function() {
    'use strict';

    var estadoConstants = {
        "RESERVA": {
            "PENDIENTE" : "pendiente",//cuando se crea la reserva
            "CUMPLIDA" : "cumplida",//cuando se cumple la fecha y hora (depende de la duracion) de la reserva
            "CONFIRMADA" : "confirmada", // cuando el encargado de local informa la asistencia
            "CALIFICABLE" : "calificable", // cuando transcurren N hs desde la reserva
            "VENCIDA" : "vencida",// cuando el encargado de local informa que el usuario no se ha presentado
            "CANCELADA" : "Cancelada",// cuando el usuarioReserva cancela desde la app o la web o el encargado de un local cancela una reserva hecha por el mismo
            "CALIFICADA" : "Calificada"// cuando el usuarioNegocio califica una reserva ya cumplida y confirmada
        },
        "PROMOCION": {
            "ACTIVA": "activa",
            "FINALIZADA": "finalizada"
        },
        "MODALIDAD_COBRO": {
            "CUBIERTOMENU": "cubierto+menu",
            "MENU": "menu",
            "CUBIERTOS": "cubiertos",
            "SIN_COMISION": "sin_comision"
        }
    };

    module.exports = estadoConstants;
})();
