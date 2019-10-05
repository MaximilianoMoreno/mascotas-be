db.reservas.count({"fechaReserva": /04\/2018/})

db.reservas.find({idLocal: ObjectId("5a859deb128103ac7a1a66e4")})

db.reservas.count( { $and: [{"fechaReserva": /04\/2018/}, {idLocal: ObjectId("5a859deb128103ac7a1a66e4")}] })



db.reservas.find({"fechaReserva": /04\/2018/})

db.locals.find({ 'idPoloGastronomico': ObjectId("59e88eca0baf66210020890b") })

db.locals.findOne({'_id': ObjectId("5ad4bed95424d10d2524ae50")})


db.locals.aggregate([
	{ $sample: { size: 300 } },
   {
     $lookup:
       {
         from: "negocios",
         localField: "idNegocio",
         foreignField: "_id",
         as: "idNegocio"
       }
       
  },
  {
  	$unwind: { path:'$idNegocio', preserveNullAndEmptyArrays: true }
  }, 
  {
    $lookup:
      {
         from: "tipococinas",
         localField: "idTipoCocinaPrincipal",
         foreignField: "_id",
         as: "idTipoCocinaPrincipal"
       }
       
  },
  {
	$unwind: { path:'$idTipoCocinaPrincipal', preserveNullAndEmptyArrays: true }
  }, 
  {
    $lookup:
      {
         from: "localdescuentos",
         localField: "idLocalDescuento",
         foreignField: "_id",
         as: "idLocalDescuento"
       }
       
  },
  {
	$unwind: { path:'$idLocalDescuento', preserveNullAndEmptyArrays: true }
  }, 
  {
    $lookup:
      {
         from: "descuentos",
         localField: "idLocalDescuento.idDescuento",
         foreignField: "_id",
         as: "idDescuento"
       }
       
  },
  {
	$unwind: { path:'$idDescuento', preserveNullAndEmptyArrays: true }
  },
  { 
  	$match: { "idNegocio.destacadoNegocio" : true } },
  {
   	$project: {
   		"nombreLocal": 1,
      "fotoPrincipalLocal": 1,
   		"calleLocal": 1,
   		"alturaLocal": 1,
   		"aceptaReservaNegocio": 1,
   		"idNegocio.nombreNegocio": 1,
   		"idNegocio.destacadoNegocio": 1,
   		"idTipoCocinaPrincipal": 1,
   		"fotoLocal": 1,
   		"idDescuento": 1
   		
   	}
   }
])


db.getCollection("locals").aggregate([
  {$match: {"_id":  ObjectId("5a859deb128103ac7a1a66e4")}},
  
  {
    $lookup:
        {
          from: "localpromocions",
          localField: "_id",
          foreignField: "idLocal",
          as: "localpromocions"
        }
  },
  {
    $lookup:
        {
          from: "opcionpromocions",
          localField: "localpromocions.idOpcionPromocion",
          foreignField: "_id",
          as: "idOpcionPromocion"
        }
  },
  {
    $lookup:
        {
          from: "promocions",
          localField: "localpromocions.idPromocion",
          foreignField: "_id",
          as: "promociones"
        }
  },
  {
    $lookup:
        {
          from: "horariopromocions",
          localField: "localpromocions.idPromocion",
          foreignField: "idPromocion",
          as: "horarioPromocion"
        }
  },
  {
    $lookup:
        {
          from: "horariovalidopromocions",
          localField: "horarioPromocion.idHorarioValidoPromocion",
          foreignField: "_id",
          as: "horarioValidoPromocion"
        }
  }
]);

db.getCollection("locals").aggregate([
  //      { $sample: { size: 10 } },
  {$match: {"_id":  ObjectId("5a859deb128103ac7a1a66e4")}},
  { $sort: { aceptaReservaNegocio: -1 }},
  {
    $lookup:
        {
          from: "negocios",
          localField: "idNegocio",
          foreignField: "_id",
          as: "idNegocio"
        }
  },
  {
    $unwind: { path:'$idNegocio', preserveNullAndEmptyArrays: true }
  },
  {
    $lookup:
        {
          from: "tipococinas",
          localField: "idTipoCocinaPrincipal",
          foreignField: "_id",
          as: "idTipoCocinaPrincipal"
        }
    
  },
  {
    $unwind: { path:'$idTipoCocinaPrincipal', preserveNullAndEmptyArrays: true }
  },
  {
    $lookup:
        {
          from: "localdescuentos",
          localField: "idLocalDescuento",
          foreignField: "_id",
          as: "idLocalDescuento"
        }
  },
  {
    $unwind: { path:'$idLocalDescuento', preserveNullAndEmptyArrays: true }
  },
  {
    $lookup:
        {
          from: "descuentos",
          localField: "idLocalDescuento.idDescuento",
          foreignField: "_id",
          as: "idDescuento"
        }
  },
  {
    $unwind: { path:'$idDescuento', preserveNullAndEmptyArrays: true }
  },
  {
    $match: { "idNegocio.destacadoNegocio" : true }
  },
  {
    $lookup:
        {
          from: "localpromocions",
          localField: "_id",
          foreignField: "idLocal",
          as: "localpromocions"
        }
  },
  {
    $lookup:
        {
          from: "opcionpromocions",
          localField: "localpromocions.idOpcionPromocion",
          foreignField: "_id",
          as: "idOpcionPromocion"
        }
  },
  {
    $lookup:
        {
          from: "promocions",
          localField: "localpromocions.idPromocion",
          foreignField: "_id",
          as: "promociones"
        }
  },
  {
    $lookup:
        {
          from: "horariopromocions",
          localField: "localpromocions.idPromocion",
          foreignField: "idPromocion",
          as: "horarioPromocion"
        }
  },
  {
    $lookup:
        {
          from: "horariovalidopromocions",
          localField: "horarioPromocion.idHorarioValidoPromocion",
          foreignField: "_id",
          as: "horarioValidoPromocion"
        }
  },
  
  {
    $lookup:
        {
          from: "opcionpromocions",
          localField: "localpromocions.idOpcionPromocion",
          foreignField: "_id",
          as: "opcionesPromocion"
        }
  },
  {
    $addFields: {
      idPromocion: {
        $map: {
          input: "$promociones",
          as: "promocion",
          in: {
            idPromocion: "$$promocion._id",
            nombrePromocion: "$$promocion.nombrePromocion",
            nombreCortoPromocion: "$$promocion.nombreCortoPromocion",
            colorPromocion: "$$promocion.colorPromocion",
            imagenWebPromocion: "$$promocion.imagenWebPromocion",
            imagenAppPromocion: "$$promocion.imagenAppPromocion",
            iconoPromocion: "$$promocion.iconoPromocion",
            terminosCondicionesPromocion: "$$promocion.terminosCondicionesPromocion",
            duracionDesdePromocion: "$$promocion.duracionDesdePromocion",
            duracionHastaPromocion: "$$promocion.duracionHastaPromocion",
            marcadorPromocionNormal: "$$promocion.marcadorPromocionNormal",
            marcadorPromocionSeleccionado: "$$promocion.marcadorPromocionSeleccionado",
            horarioValidoPromocion: "$horarioValidoPromocion",
            idOpcionPromocion: {
              $map: {
                input: "$opcionesPromocion",
                as: "opcionPromocion",
                in:
                    {
                      _id: "$$opcionPromocion._id",
                      idOpcion: "$$opcionPromocion.idOpcion",
                      nombreOpcion: "$$opcionPromocion.nombreOpcion",
                      descripcionOpcion: "$$opcionPromocion.descripcionOpcion",
                      precioOpcion: "$$opcionPromocion.precioOpcion",
                      fotoOpcion: "$$opcionPromocion.fotoOpcion",
                      cantidadDisponible: "$$opcionPromocion.cantidadDisponible",
                      nombrePromocion: "$$opcionPromocion.nombrePromocion",
                    }
              }
            }
          }
        }
      }
      
    }
  },
  {
    $project: {
      "nombreLocal": 1,
      "fotoPrincipalLocal": 1,
      "calleLocal": 1,
      "alturaLocal": 1,
      "aceptaReservaNegocio": 1,
      "idNegocio.nombreNegocio": 1,
      "idNegocio.destacadoNegocio": 1,
      "idTipoCocinaPrincipal": 1,
      "fotoLocal": 1,
      "idPromocion": 1,
      "latitudLocal": 1,
      "longitudLocal": 1
    }
  }
])