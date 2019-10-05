(function () {
  'use strict';

  var mailService = {
    "enviarMailReserva": enviarMailReserva,
    "olvidePass": olvidePass,
    "olvidePassNegocio": olvidePassNegocio,
    "resetPass": resetPass,
    "mailRegistro": mailRegistro,
    "cancelarReserva": cancelarReserva,
    "confirmaAsistenciaReserva": confirmaAsistenciaReserva
  };
  var _ = require('lodash');
  var nodemailer = require('nodemailer');

  module.exports = mailService;

  var smtpConfig = {
    // host: 'mail.guiamendozagourmet.com',
    // port: 587,
    // secure: false,
    // auth: {
    //   user: 'reservas@guiamendozagourmet.com',
    //   pass: 'mendozaVINOporcopa++19'
    // },
    // tls: {
    //   rejectUnauthorized: false
    // }
  };

  var transporter = nodemailer.createTransport(smtpConfig);
  var EmailTemplate = require('email-templates').EmailTemplate;
  var path = require('path');
  var templateDir = './app/templates';

  function enviarMailReserva(contactoUsuario, local, datosReserva, descuento) {
    if (_.isUndefined(contactoUsuario.apellido)) {
      contactoUsuario.apellido='';
    }
    var nombreLocal, tiempoCancelacion;
    
    if (local.nombreLocal) { 
      nombreLocal = local.nombreLocal;
    } else { 
      nombreLocal = local.idNegocio.nombreNegocio;
    }
  
    tiempoCancelacion = local.margenCancelacionReserva === 1 ? '1 hora' : local.margenCancelacionReserva + ' horas';
    
    var reserva = [
      {
        nombreReserva: contactoUsuario.nombre,
        nombreLocal: nombreLocal,
        cubiertosReservados: datosReserva.cubiertosReservados,
        fechaReserva: datosReserva.fechaReserva,
        horaReserva: datosReserva.horaReserva,
        direccionLocal: local.calleLocal + ' ' + local.alturaLocal,
        telefonoLocal: local.telContacto,
        nombreApellidoReserva: contactoUsuario.nombre +' '+ contactoUsuario.apellido,
        mailReserva: contactoUsuario.email,
        telefonoReserva: datosReserva.telefonoUsuarioReserva,
        idReserva: datosReserva.idReserva,
        urlReserva: datosReserva.urlReserva,
        nombreDescuento: descuento ? descuento.nombreDescuento : null,
        fotoLocal: local.fotoPrincipalLocal,
        tiempoCancelacion: tiempoCancelacion
      }
    ];
    console.log('reserva ');
    console.log(reserva);

    loadTemplate('reserva', reserva).then(function(results) {
      return Promise.all (results.map(function (result) {
        var mailOptionsUsuario = {
          from: 'Reservas #LaGuia <reservas@guiamendozagourmet.com>',
          to: contactoUsuario.email, // + ', ' + local.idContacto.mailContacto,
          bcc: 'reservas@guiamendozagourmet.com',
          subject: 'Reserva realizada en ' + nombreLocal,
          html: result.email.html
        }; 
        verificarMailServer(mailOptionsUsuario);
      }));
    }).then(function () {
      console.log('Enviado');
    });
    
    loadTemplate('reservaNegocio', reserva).then(function(results) {
      return Promise.all (results.map(function (result) {
        var mailReservaNegocio = {
          from: 'Reservas #LaGuia <reservas@guiamendozagourmet.com>',
          to: local.idContacto.mailReserva,
          bcc: 'reservas@guiamendozagourmet.com',
          subject: 'Reserva realizada en ' + nombreLocal,
          html: result.email.html
        }; 
        verificarMailServer(mailReservaNegocio);
      }));
    }).then(function () {
      console.log('Enviado');
    });
  }

  function olvidePass(contactoUsuario, token) {
    var passTemp = [
      {
        url: 'https://guiamendozagourmet.com/reset.php?token=' + token
      }
    ];

    loadTemplate('olvidePassUsuario', passTemp).then(function(results) {
      return Promise.all (results.map(function (result) {
        var mailOptionsOlvidePass = {
          from: 'Recuperar Contraseña #LaGuia <reservas@guiamendozagourmet.com>',
          to: contactoUsuario,
          subject: '#LaGuia - Recuperar Contrasena',
          html: result.email.html,
          text: 'Usted esta recibiendo esto porque usted (u otra persona) ha solicitado un cambio de la contraseña de su cuenta.\n\n' +
          'Por favor, haga click en el siguiente enlace, o copie y pegue el mismo en su navegador para completar el proceso:\n\n' +
          'https://guiamendozagourmet.com/reset.php?token=' + token + '\n\n' +
          'Si usted no solicito este cambio, por favor, ignore este correo y su contraseña permanecera sin cambios.\n'
        };
        verificarMailServer(mailOptionsOlvidePass);
      }));
    }).then(function () {
      console.log('Enviado');
    });
  }

  function olvidePassNegocio(contactoUsuario, token) {
    var passTempNegocio = [  
      {
        url: 'https://guiamendozagourmet.com/lacocina/reset.php?token=' + token
      }
    ];

    loadTemplate('olvidePassNegocio', passTempNegocio).then(function(results) {
      return Promise.all (results.map(function (result) {
        var mailOptionsOlvidePass = {
          from: 'Recuperar Contraseña #LaGuia <reservas@guiamendozagourmet.com>',
          to: contactoUsuario,
          subject: '#LaGuia - Recuperar Contrasena',
          html: result.email.html,
          text: 'Usted esta recibiendo esto porque usted (u otra persona) ha solicitado un cambio de la contraseña de su cuenta.\n\n' +
          'Por favor, haga click en el siguiente enlace, o copie y pegue el mismo en su navegador para completar el proceso:\n\n' +
          'https://guiamendozagourmet.com/lacocina/reset.php?token=' + token + '\n\n' +
          'Si usted no solicito este cambio, por favor, ignore este correo y su contraseña permanecera sin cambios.\n'
        };
        verificarMailServer(mailOptionsOlvidePass);
      }));
    }).then(function () {
      console.log('Enviado');
    });
  }

  function resetPass(contactoUsuario) {
    var mailOptionsResetPass = {
      from: 'reservas@guiamendozagourmet.com',
      to: contactoUsuario ,
      subject: '#LaGuia su contrasena a ha sido reestablecida',
      text: 'Hola,\n\n' +
      'Esta es una confirmacion que la contrasena de su cuenta ' + contactoUsuario + ' ha sido cambiada.\n'
    };
    verificarMailServer(mailOptionsResetPass);
  }

  function verificarMailServer(mailOptions) {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log('Mail server is ready to take our messages');
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            console.log(info);
          }
        });
      }
    });
  }

  function loadTemplate (templateName, contexts) {
    var template = new EmailTemplate(path.join(templateDir, templateName));
    console.log('ruta'+template);
    return Promise.all(contexts.map(function (context) {
      return new Promise (function (resolve, reject) {
        template.render (context, function (err, result) {
          if (err) {
            reject(err);
            console.log(err);
          }
          else { 
            resolve ({
              email: result,
              context,
            });
          }
        });
      });
    }));
  }

  function mailRegistro (usuarioNuevo) {
    var user = [
      {
        usuario: usuarioNuevo.email
      }
    ];

    loadTemplate('registroUsuario', user).then(function(results) {
      return Promise.all (results.map(function (result) {
        var mailRegistro = {
          from: 'Registro #LaGuia <reservas@guiamendozagourmet.com>',
          to: usuarioNuevo.email, 
          bcc: 'reservas@guiamendozagourmet.com',
          subject: 'Registro en Guía Mendoza Gourmet',
          html: result.email.html
        }; 
        verificarMailServer(mailRegistro);
      }));
    }).then(function () {
      console.log('Enviado');
    });
  }

  function cancelarReserva (reservaCancelada) {
    var nombreLocal, tiempoCancelacion; 
    if (reservaCancelada.idLocal.nombreLocal) { 
      nombreLocal = reservaCancelada.idLocal.nombreLocal; 
    } else { 
      nombreLocal = reservaCancelada.idLocal.idNegocio.nombreNegocio; 
    } 
    if (reservaCancelada.idLocal.margenCancelacionReserva == 1) {
      tiempoCancelacion = '1 hora';
    } else {
      tiempoCancelacion = reservaCancelada.idLocal.margenCancelacionReserva + ' horas';
    }

    var reserva = [
      {
        nombreLocal: nombreLocal,
        cubiertosReservados: reservaCancelada.cubiertosReservados,
        fechaReserva: reservaCancelada.fechaReserva,
        horaReserva: reservaCancelada.horaReserva,
        direccionLocal: reservaCancelada.idLocal.calleLocal + ' ' + reservaCancelada.idLocal.alturaLocal,
        telefonoLocal: reservaCancelada.idLocal.telContacto,
        nombreApellidoReserva: reservaCancelada.idUsuarioReserva.nombre + ' ' + reservaCancelada.idUsuarioReserva.apellido,
        mailReserva: reservaCancelada.idUsuarioReserva.email,
        telefonoReserva: reservaCancelada.idUsuarioReserva.nroCelular,
        fotoLocal: reservaCancelada.idLocal.fotoPrincipalLocal,
        tiempoCancelacion: tiempoCancelacion
      }
    ];

    loadTemplate('cancelarReserva', reserva).then(function(results) {
      return Promise.all (results.map(function (result) {
        var mailReservaCancelada = {
          from: 'Reservas #LaGuia <reservas@guiamendozagourmet.com>',
          to: reservaCancelada.idUsuarioReserva.email,
          bcc: 'reservas@guiamendozagourmet.com',
          subject: '#LaGuia - Reserva cancelada en ' + nombreLocal,
          html: result.email.html
        }; 
        verificarMailServer(mailReservaCancelada);
      }));
    }).then(function () {
      console.log('Enviado');
    });

    loadTemplate('cancelarReservaNegocio', reserva).then(function(results) {
      return Promise.all (results.map(function (result) {
        var mailReservaCanceladaNegocio = {
          from: 'Reservas #LaGuia <reservas@guiamendozagourmet.com>',
          to: reservaCancelada.idLocal.idContacto.mailReserva,
          bcc: 'reservas@guiamendozagourmet.com',
          subject: '#LaGuia - Reserva cancelada en ' + nombreLocal,
          html: result.email.html
        }; 
        verificarMailServer(mailReservaCanceladaNegocio);
      }));
    }).then(function () {
      console.log('Enviado');
    });
  } 

  function confirmaAsistenciaReserva (asistencia, reserva) {
    var nombreLocal; 
    if (reserva.idLocal.nombreLocal) { 
      nombreLocal = reserva.idLocal.nombreLocal;
    } else { 
      nombreLocal = reserva.idLocal.idNegocio.nombreNegocio;
    } 
    var dtoReserva = [
      {
        idReserva: reserva._id,
        nombreUsuario: reserva.idUsuarioReserva.nombre,
        nombreLocal: nombreLocal, 
        cubiertosReservados: reserva.cubiertosReservados,
        fechaReserva: reserva.fechaReserva,
        horaReserva: reserva.horaReserva,
        direccionLocal: reserva.idLocal.calleLocal + ' ' + reserva.idLocal.alturaLocal,
        telefonoLocal: reserva.idLocal.telContacto, 
        fotoLocal: reserva.idLocal.fotoPrincipalLocal
      }
    ];
    var template = asistencia ? 'reservaVino': 'reservaNoVino';
    var asunto = asistencia ? "Califica " :  "No has asistido a ";
    loadTemplate(template, dtoReserva).then(function(results) {
      return Promise.all (results.map(function (result) {
        var mailReservaNoVino = {
          from: 'Reservas #LaGuia <reservas@guiamendozagourmet.com>',
          to: reserva.idUsuarioReserva.email,
          bcc: 'reservas@guiamendozagourmet.com',
          subject: '#LaGuia - ' + asunto + 'tu reserva en ' + nombreLocal,
          html: result.email.html
        }; 
        verificarMailServer(mailReservaNoVino);
      }));
    }).then(function () {
      console.log('Enviado');
    });
  }

})();
