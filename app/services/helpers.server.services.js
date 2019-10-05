(function () {
  'use strict';

  var service = {
    "getById": getById,
    "getGrillaHoraria": getGrillaHoraria,
    "getDistanceFromLatLonInKm": getDistanceFromLatLonInKm,
    "estaVencida": estaVencida,
    "getHora": getHora,
    "getDiaActual": getDiaActual,
    "getHoraCambioEstado": getHoraCambioEstado,
    "getFechaCambioEstadoPendientes": getFechaCambioEstadoPendientes,
    "ordenarFecha": ordenarFecha
  };
  var _ = require('lodash');

  module.exports = service;

  function getById(schema, id) {
    var promise = new Promise(function (resolve, reject) {
        schema.findById(id, function (error, descuentoEncontrado) {
          if (descuentoEncontrado) {
            resolve(descuentoEncontrado);
          } else {
            reject(new Error('No existe el item con id: ' + id));
          }
        });
      }
    );
    return promise;
  }

  //funcion para crear incrementos de media hora desde un hora hasta otra desde strings
  function getGrillaHoraria(horaDesde, horaHasta, fechaReserva, horaActual, diaDisponibilidad) {
    return (cadaMediaHora(horaDesde, horaHasta, fechaReserva, horaActual, diaDisponibilidad));
  }

  var toInt = function(time){
    var tiempo = time.split(':').map(parseFloat);
    return (tiempo[0]*2 + tiempo[1]/30);
  };

  var toTime = function(int){
    var hora = Math.floor(int/2);
    if ( hora >= 24 )
      hora -= 24;

    hora = hora === 0 ? "00" : hora;
    if(hora<10){
      hora ='0'+hora;
    }

    return [hora, int % 2 ? '30' : '00'].join(':');
  };

  var range = function(from, to){
    var rango = Array(to-from+1).fill();

    for (var i = 0; i < rango.length; i++) {
      rango[i] = from + i;
    }
    return rango;
  };

  //funcion que convierte una hora a int, luego crea un rango entre esas horas y despues lo completa convirtiendo cada int a hora nuevamente
  //viene de: https://codereview.stackexchange.com/questions/128260/populating-an-array-with-times-with-half-hour-interval-between-them
  var cadaMediaHora = function(t1, t2, fechaReserva, horaActual, diaDisponibilidad){
    console.log('t1,t2, fechaReserva, horaActual, fechaDisponibilidad');
    console.log(t1,t2, fechaReserva, horaActual, diaDisponibilidad);
    
    var rangoHoras = [];

    var horaInicio =  t1.split(':').map(parseFloat);
    var horaFin =  t2.split(':').map(parseFloat);

    if ( horaFin[0] < horaInicio[0] && horaFin[0] >= 0 ){
      horaFin[0] += 24;
      t2 = horaFin[0] + ":" + horaFin[1];
    }
    
    //mostrar solo las reservas disponibles despues del horario disponible
    if(fechaReserva <= diaDisponibilidad){
      if(horaActual.hora > horaInicio[0] && horaActual.hora > horaFin[0]){
        return rangoHoras;
      }

      if (horaActual.hora > horaInicio[0]){
        t1 = horaActual.hora + ":" + horaActual.minuto;
      }
    }

    var rangoNums = range(toInt(t1), toInt(t2));

    _.each(rangoNums, function(hora){
      rangoHoras.push(toTime(hora));
    });
    return rangoHoras;
  };

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  function estaVencida(reserva) {
    var partesFecha =reserva.fechaReserva.split('/');
    var fechaReserva = Number(getFechaCompleta(partesFecha[2], partesFecha[1], partesFecha[0]));
    partesFecha =getDiaHoy().split('/');
    var fechaActual = Number(getFechaCompleta(partesFecha[2], partesFecha[1], partesFecha[0]));
    return fechaActual > fechaReserva;
  }

  function getDiaHoy(){
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var date = today.getDate();

    return (date + '/' + month + '/' + year);
  }

  function getFechaCompleta(anio, mes, dia) {
    if(parseInt(dia) < 10 && dia.length === 1){
      dia='0'+dia;
    }
    if(parseInt(mes) < 10 && mes.length === 1){
      mes='0'+mes;
    }

     return anio + mes + dia;
  }

  function getHora(hora){
    var horaFormateada;
    var minutoFormateada;
    var hm = {};

    var h = hora.split(':')[0];
    var m = hora.split(':')[0];

    horaFormateada = hora.includes("PM") ? parseInt(h) + 12 :  parseInt(h);
    minutoFormateada = parseInt(m) > 30 ?  horaFormateada + 1 : 30;

    hm.hora = horaFormateada;
    hm.minuto = minutoFormateada;

    return hm;
  }

  function getDiaActual(){
    var today = new Date();

    var year = today.getFullYear();
    var month = today.getMonth();
    var date = today.getDate();

    var day = new Date(year, month, date);
    var dia = parseInt(day.getDate()), mes = parseInt(day.getMonth()+ 1), anio = parseInt(day.getFullYear());
    if(dia<10){
      dia='0'+dia;
    }
    if(mes<10){
      mes='0'+mes;
    }

    return dia + "/" + mes + "/" + anio;
  }

  function getHoraCambioEstado(margen){
    var today = new Date();
    var hora = today.getHours();

    hora = margen ? hora + parseInt(margen) : hora;

    var hDate = new Date('01/01/2011');
    hDate =  hDate.setHours(hora);

    return hDate;
  }

  function getFechaCambioEstadoPendientes(reserva){
    var hora = reserva.horaReserva.split(":");
    var fecha = reserva.fechaReserva.split("/");
    var horaCambio  =  hora[0] + ':' + hora[1];
    var hDate = new Date('01/01/2011 ' + horaCambio);

    return hDate;
  }

  //https://stackoverflow.com/questions/30691066/sort-a-string-date-array
function ordenarFecha(reservas){
  var dateStrings = ["09/06/2015", "25/06/2015", "22/06/2015", "25/07/2015", "18/05/2015"];
  var sortedStrings = dateStrings.sort(function(a,b) {
    var aComps = a.split("/");
    var bComps = b.split("/");
    var aDate = new Date(aComps[2], aComps[1], aComps[0]);
    var bDate = new Date(bComps[2], bComps[1], bComps[0]);
    return aDate.getTime() - bDate.getTime();
  });

    return sortedStrings;
  }

})();
