let lstBuzon = null;
let militarActivo = null;
let lstBuzonApoyo = null;
let lstBuzonCarta = null;
let apoyoActivo = null;
let CReembolso = {};
let copia = null;
let posicionModificar = null;

/**
* Listar Buzones
*
* @param int
* @return void
*/
function listaBuzon(est) {

    //Reembolso
    var url = Conn.URL + "wreembolso/listar/" + est;
    var promesa = CargarAPI({
        sURL: url,
        metodo: 'GET',
        valores: ''
    });
    promesa.then(function (xhRequest) {
        lstBuzon = JSON.parse(xhRequest.responseText);
        crearBuzon(est);
    });

    //Apoyo
    var url2 = Conn.URL + "wapoyo/listar/" + est;
    var promesaApoyo = CargarAPI({
        sURL: url2,
        metodo: 'GET',
        valores: ''
    });
    promesaApoyo.then(function (xhRequest) {
        lstBuzonApoyo = JSON.parse(xhRequest.responseText);
        crearBuzonApoyo(est);
    });

    //Carta Aval
    var url3 = Conn.URL + "wcarta/listar/" + est;
    var promesaCarta = CargarAPI({
        sURL: url3,
        metodo: 'GET',
        valores: ''
    });
    promesaCarta.then(function (xhRequest) {
        lstBuzonCarta = JSON.parse(xhRequest.responseText);
        crearBuzonCarta(est);
    });
}

/**
* Crear Buzones del sistema
*
* @param int
* @return void
*/
function crearBuzon(est) {
    console.log('Cargando el buzon de Reembolso...');
    $("#lista").html(`<li style="background-color:#CCCCCC">
                    <div class="row" >
                        <div class="col-sm-1" ><b>Reembolso</b></div>
                        <div class="col-sm-1"><b>Cedula</b></div>
                        <div class="col-sm-3"><b>Nombre y Apellido</b></div>
                        <div class="col-sm-1"><b>F.Solicitud</b></div>
                        <div class="col-sm-2"><b>M.Solicitud</b></div>
                        <div class="col-sm-2"><b>M.Aprobado</b></div>
                        <div class="col-sm-1"><b>Estatus</b></div>
                   </div>
                </li>`);
    lstBuzon.forEach(v => {
        $("#lista").append(CargarBuzonReembolso(v, est));
    });
}

/**
* Cargar Datos del Buzones del sistema
*
* @param {object}
* @return void
*/
function CargarBuzonReembolso(v, est){
  var alertSegui = "";
  switch (v.estatusseguimiento){
    case 1:
      alertSegui = '<i class="fa fa-info-circle" style="font-size: 16px; color: red; margin-left: -100px;;"></i>';
      break;
    case 2:
      alertSegui = '<small class="label label-info"><i class="fa fa-comment-o"></i>Recomendacion</small>';
      break;
  }
  var fcreacion = Util.ConvertirFechaHumana(v.fechacreacion);
  var msolicitado = numeral(parseFloat(v.montosolicitado)).format('0,0[.]00 $');
  var maprobado = numeral(parseFloat(v.montoaprobado)).format('0,0[.]00 $');
  var con = conviertEstatus(v.estatus) + alertSegui;
  return `<li>
            <div class="row">
              <div class="col-sm-1">
                <span class="text"><a href="#" onclick="detalleBuzon('${v.id}','${v.numero}','${est}')">${v.numero }</a></span>
              </div>
              <div class="col-sm-1"><span class="text">${v.id}</span></div>
              <div class="col-sm-3">${v.nombre}</div>
              <div class="col-sm-1">${fcreacion}</div>
              <div class="col-sm-2">${msolicitado}</div>
              <div class="col-sm-2">${maprobado}</div>
              <div class="col-sm-1">${con}</div>
              <div class="tools" style="margin-right: 50px;">
                  <i class="fa  fa-check" title="Aceptar" style="color: green; font-size: 18px"
                    onclick="verificarAprobacion('${v.numero}','${v.estatus}','${v.id}')"></i>
                  <i class="fa fa-trash" title="Rechazar" style="font-size: 18px"
                    onclick="verificarRechazo('${v.numero}','${v.estatus}','${v.id}')"></i>
              </div>
            </div>
          </li>`;
}

/**
* Convertir Estatus del sistema
*
* @param int
* @return int
*/
function conviertEstatus(est){
  var estatus = "";
  switch (est){
      case -1:
        estatus = "Rechazado";
        break;
      case 0:
        estatus = "Inicial";
        break;
      case 1:
        estatus = "Pendiente";
        break;
      case 2:
        estatus = "En Jefatura";
        break;
      case 3:
        estatus = "En Gerencia";
        break;
      case 4:
        estatus = "Aprobado";
        break;
      case 5:
        estatus = "Aprobado";
        break;
  }
  return estatus;
}


function verificarAprobacion(num, esta, id) {
    $("#_contenido").html("¿Está seguro que desea Aprobar el reembolso " + num + "?");
    var botones = `<button type="button" class="btn btn-success" data-dismiss="modal" id="_aceptar"
                      onClick="aprobarReembolso('${num}','${esta}','${id}')">Si</button>
                   <button type="button" class="btn btn-primary" data-dismiss="modal">No</button>`;
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}

function verificarRechazo(num, esta, id) {
    $("#_contenido").html("¿Está seguro que desea Rechazar el reembolso " + num + "?");
    var botones = `<button type="button" class="btn btn-success" data-dismiss="modal" id="_aceptar"
                      onClick="rechazarReembolso('${num}','${esta}','${id}')">Si</button>
                   <button type="button" class="btn btn-primary" data-dismiss="modal">No</button>`;
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}


/**
* Aprobación del Buzon de los estados del Reembolso
*
* @param {int}
* @param {int}
* @param {string}
* @return void
*/
function aprobarReembolso(num, est, id) {
    var url = Conn.URL + "wreembolso/estatus";
    //Object {object} Estatus
    var datos = {
      ID: id,
      numero: num,
      estatus: parseInt(est) + 1
    };

    var promesa = CargarAPI({
        sURL: url,
        metodo: 'PUT',
        valores: datos,
    });
    promesa.then(function (xhRequest) {
        respuesta = JSON.parse(xhRequest.responseText);
        if(respuesta.msj == "") respuesta.msj = "Se proceso con exito....";
        $.notify(respuesta.msj, "success");
        listaBuzon(est);
    });
}

/**
* Rechazos del Buzon de los estados del Reembolso
*
* @param {int}
* @param {int}
* @param {string}
* @return void
*/
function rechazarReembolso(num, est, id) {
    var url = Conn.URL + "wreembolso/estatus";
    //Object {object} Estatus
    var datos = {
      ID: id,
      numero: num,
      Estatus: -1
    };
    var promesa = CargarAPI({
        sURL: url,
        metodo: 'PUT',
        valores: datos
    });
    promesa.then(function (xhRequest) {
        respuesta = JSON.parse(xhRequest.responseText);
        if(respuesta.msj == "") respuesta.msj = "Se proceso con exito....";
        $.notify(respuesta.msj);
        listaBuzon(est);
    });

}

function detalleBuzon(id, numero, est,tipo) {
    console.log('Iniciando Detalle del Buzón...')
    var url = Conn.URL + "militar/crud/" + id;
    var promesa = CargarAPI({
        sURL: url,
        metodo: 'GET',
        valores: '',
        Objeto: militar
    });
    promesa.then(function (xhRequest) {
        militarActivo = JSON.parse(xhRequest.responseText);
        switch (tipo){
            case "A":
              llenarBuzonApoyo(numero, est);
              break;
            case "C":
              llenarBuzonCarta(numero, est);
              break;
            default:
              llenarBuzonReembolso(numero, est);
        }
    });
}

function llenarBuzonReembolso(numero,est) {
    $('#lblcedula').text(militarActivo.Persona.DatoBasico.cedula);
    var ncompleto = militarActivo.Persona.DatoBasico.nombreprimero + " " + militarActivo.Persona.DatoBasico.apellidoprimero;
    $('#lblnombre').text(ncompleto);
    $('#lblgrado').text(militarActivo.Grado.descripcion);
    $('#lblsituacion').text(Util.ConvertirSitucacion(militarActivo.situacion));
    $('#lblnumero').text(numero);
    $('#lblcomponente').text(militarActivo.Componente.descripcion);

    var rutaimg = Conn.URLIMG;
    url = rutaimg + militarActivo.Persona.DatoBasico.cedula + ".jpg";
    if (militarActivo.Persona.foto != undefined) {
        rutaimg = Conn.URLTEMP;
        url = rutaimg + militarActivo.Persona.DatoBasico.cedula + "/foto.jpg";
    }
    $("#fotoperfil").attr("src", url);
    crearTablaConceptos(numero,est);
    mostrarTextoObservacion(est);
    $('#listasProgramas').hide();
    $('#detalle').slideToggle();
}

function crearTablaConceptos(numero,est) {
    var fila = "";
    var pos = 0;
    var lst = militarActivo.CIS.ServicioMedico.Programa.Reembolso;
    var i = 0;
    lst.forEach( v => {
        if (v.numero == numero) {
            pos = i;
            posicionModificar = i;
        }
        i++;
    });
    CReembolso = lst[pos]; //Cargar detalles del reembolso
    if(CReembolso.Seguimiento.Estatus != undefined) $("#estSeguimiento").val(CReembolso.Seguimiento.Estatus);
    if(est > 2){
      activarCambioEstatus();
    }
    $("#cuerpoEditarConceptos").html('');
    var jj = new Array();
    CReembolso.Concepto.forEach( v => {
        jj.push(v.afiliado);
        $("#cuerpoEditarConceptos").append(CargarDetalleConcepto(v));
    });
    $("#totalter").html(CReembolso.montosolicitado.toFixed(2));
    $("#totalapro").html(CReembolso.montoaprobado);
    $(".borrarconcepto").click(function () {
        $(this).parents('tr').eq(0).remove();
        if ($("#cuerpoEditarConceptos tr").length == 0) {

        }
        calcularAcumulado("r");
    });
    $(".mntsoli").on("keypress",function(e){
        var key = e.keyCode || e.which;
        if(key == 13){
            calcularPorcen(this,'r');
        }
    });

    $(".porcentajecalculo").on("keypress",function(e){
        var key = e.keyCode || e.which;
        if(key == 13){
            calcularPorcen(this,'r');
        }
    });
    $(".modconcep").click(function () {
        calcularAcumulado("r");
    });

    //Crear tabla de objservaciones
    if (CReembolso.Seguimiento.Observaciones != undefined) {
        var lstObs = CReembolso.Seguimiento.Observaciones;
        $("#cuerpoObservaciones").html('');
        $("#cuerpoOpiniones").html('');
        lstObs.forEach( v => {
            var tipo = v.contenido.split("|||");
            var cestatus = conviertEstatus(CReembolso.estatus);
            var tipo = tipo[0];
            if(tipo[1] != undefined) {
              $("#cuerpoOpiniones").append(`<tr><td>${tipo}</td><td>${cestatus}</td></tr>`);
            }else {
              $("#cuerpoObservaciones").append(`<tr><td>${v.contenido}</td><td></td></tr>`);
            }
        });
    }

    validarDetalleReembolso(est);
    console.log('Entregando contenido');
}

function CargarDetalleConcepto(v){
  var mntApo = 0;
  if(v.DatoFactura.montoaprobado > 0) mntApo = v.DatoFactura.montoaprobado;
  var ffact = Util.ConvertirFechaHumana(v.DatoFactura.fecha);
  var picar = v.afiliado.split("-");
  var picar2 = picar[1].split("(");
  var tam = picar2[1].length;
  var parent = picar2[1].substr(0,tam-1);
  var nombre = picar[0];
  var cedula = picar2[0];
  var fecha = Util.ConvertirFechaHumana(v.DatoFactura.fecha);
  return `<tr>
            <td>${parent}</td>
            <td>${nombre}</td>
            <td>${cedula}</td>
            <td>${v.descripcion}</td>
            <td><input type="text" value="${v.DatoFactura.numero}" class="numfact"></td>
            <td style="display: none">${v.DatoFactura.Beneficiario.rif}</td>
            <td style="display: none">${v.DatoFactura.Beneficiario.razonsocial}></td>
            <td><input type="text" class="ffactReembolso" value="${fecha}"></input></td>
            <td><input type="text" onblur="calcularPorcen(this,'r')" class="mntsoli"
                onkeypress="return Util.SoloNumero(event,this,true)"
                value="${v.DatoFactura.monto}"></td>
            <td><input type="number" class="porcentajecalculo"
                onkeypress="return Util.SoloNumero(event,this)"
                value="${v.DatoFactura.porcentaje}" onblur="calcularPorcen(this,'r')"></td>
           <td><input type="text" value="${mntApo}" class="mntAcumulado"
                onkeypress="return Util.SoloNumero(event,this,true)"
                onblur="calcularAcumulado('r')"></td>
           <td style="width: 7%;">
                <button type="button" class="btn btn-default btn-sm borrarconcepto"
                title="Eliminar"><i class="fa fa-trash-o" style="color: red;"></i></button></td>
        </tr>`;
}

function calcularPorcen(obj,tipo){
    var por = $(obj).parents("tr").eq(0).find("input.porcentajecalculo").val();
    var soli = $(obj).parents("tr").eq(0).find("input.mntsoli").val();
    var nuevoAprobado = soli*por/100;

    $(obj).parents("tr").eq(0).find("input.mntAcumulado").val(nuevoAprobado.toFixed(2));
    calcularAcumulado(tipo);
}

function calcularAcumulado(tipo) {
    var idTabla = "";
    var idTotal = "";
    var idTotalSol = "";
    switch(tipo){
        case "r":
          idTabla = "cuerpoEditarConceptos";
          idTotal = "totalapro";
          idTotalSol = "totalter";
          break;
        case "a":
          idTabla = "cuerpoEditarConceptosApoyo";
          idTotal = "totalaproApoyo";
          idTotalSol="totalterApoyo";
          break;
        case "c":
          idTabla = "cuerpoEditarConceptosCarta";
          idTotal = "totalaproCarta";
          idTotalSol="totalterCarta";
          break;
    }

    var acumulado = 0;
    var acumulado2 = 0;
    $("#"+idTabla+" tr").each(function () {
        var mnt = $(this).find("input.mntAcumulado").eq(0).val();
        var sol = $(this).find("input.mntsoli").eq(0).val();
        if(parseFloat(mnt) > parseFloat(sol)){
            mnt = sol;
            $(this).find("input.mntAcumulado").eq(0).val(mnt);
            $.notify("El  monto aprobado no debe ser mayor al solicitado");
        }
        acumulado2 = parseFloat(acumulado2)+parseFloat(sol);
        acumulado = parseFloat(acumulado) + parseFloat(mnt);
    });
    acumulado = parseFloat(acumulado).toFixed(2);
    acumulado2 = parseFloat(acumulado2).toFixed(2);
    $("#"+idTotal).html(acumulado);
    $("#"+idTotalSol).html(acumulado2);
}


function volverLista() {
    $("#listasProgramas").slideToggle();
    $('#detalle').hide();
    $("#detalleApoyo").hide();
    $("#detalleCarta").hide();
}

function actualizarReembolso(est) {
    var MontoAprobado = 0;
    var conceptos = new Array();
    var datos = null;
    var i = 0;

    if ($("#cuerpoEditarConceptos tr").length > 0) {
        $("#cuerpoEditarConceptos tr").each(function () {
            MontoAprobado = parseFloat($(this).find("input.mntAcumulado").val());
            conceptos.push(obtenerListadoReembolso(this, i));
            i++;
        });
        CReembolso.Concepto = conceptos;
    } else {
        $.notify("Debe poseer al menos un concpeto para editar o puede rechazar el reembolso");
    }
    if (MontoAprobado == 0 ) {
      $.notify("Debe establecer un monto aprobado.");
      return false;
    }
    //
    CReembolso.montoaprobado = parseFloat($("#totalapro").html());
    CReembolso.montosolicitado = parseFloat($("#totalter").html());
    var observaciones = new Array();
    var tipoObser = "";

    if(CReembolso.estatus > 1) tipoObser = "|||" + CReembolso.estatus;
    if($("#cuerpoObservaciones tr").length > 0){
        $("#cuerpoObservaciones tr.agobs").each(function(){
           observaciones.push($(this).find("td").eq(0).html());
        });
    }
    if($("#cuerpoOpiniones tr").length > 0){
        $("#cuerpoOpiniones tr.agobs").each(function(){
            observaciones.push($(this).find("td").eq(0).html()+tipoObser);
        });
    }
    EnviarReembolso(CReembolso, observaciones);
}


function obtenerListadoReembolso(Concepto, i){
  var concep = new ConceptoReembolso();
  var facturaD = new Factura();
  var ffact = CReembolso.fechacreacion;
  if ($(Concepto).find("input.ffactReembolso").eq(0).val() != "") {
      ffact = new Date(Util.ConvertirFechaUnix($(Concepto).find("input.ffactReembolso").val())).toISOString();
  }
  facturaD.fecha = ffact;
  facturaD.monto = parseFloat($(Concepto).find("input.mntsoli").val());
  facturaD.montoaprobado = parseFloat($(Concepto).find("input.mntAcumulado").val());
  facturaD.porcentaje = parseFloat($(Concepto).find("input.porcentajecalculo").val());
  facturaD.numero = $(Concepto).find("input.numfact").val();
  facturaD.control = $(Concepto).find("input.numfact").val();
  facturaD.Beneficiario = CReembolso.Concepto[i].DatoFactura.Beneficiario;
  concep.DatoFactura = facturaD;
  concep.afiliado = CReembolso.Concepto[i].afiliado;
  concep.descripcion = CReembolso.Concepto[i].descripcion;
  return concep;
}

function EnviarReembolso(OReembolso, observaciones){
  OReembolso.Seguimiento.Estatus = parseInt($("#estSeguimiento").val());
  var wreembolso = new WReembolso();
  wreembolso.id = militarActivo.Persona.DatoBasico.cedula;
  wreembolso.numero = $('#lblnumero').text();
  wreembolso.observaciones = observaciones;
  wreembolso.nombre = militarActivo.Persona.DatoBasico.nombreprimero + " " + militarActivo.Persona.DatoBasico.apellidoprimero;
  wreembolso.Reembolso = OReembolso;
  var urlGuardar = Conn.URL + "wreembolso";
  var promesa = CargarAPI({
      sURL: urlGuardar,
      metodo: 'PUT',
      valores: wreembolso,
  });
  promesa.then(function(xhRequest) {
      respuesta = JSON.parse(xhRequest.responseText);
      if(respuesta.msj == "") respuesta.msj = "Se proceso con exito....";
      msjRespuesta(respuesta.msj);
      listaBuzon(OReembolso.estatus);
      volverLista();
  });
}

function agObservacion(tipo) {
    if ( $("#txtObservacion").val() == "" ) return false;
    var idTexto = "";
    var idTabla = "";
    var idOpi = "";
    switch (tipo){
        case "r":
          idOpi = "cuerpoOpiniones";
          idTexto = "txtObservacion";
          idTabla = "cuerpoObservaciones";
          break;
        case "a":
          idOpi = "cuerpoOpinionesApoyo";
          idTexto = "txtObservacionApoyo";
          idTabla = "cuerpoObservacionesApoyo";
          break;
        case "c":
          idOpi = "cuerpoOpinionesCarta";
          idTexto = "txtObservacionCarta";
          idTabla = "cuerpoObservacionesCarta";
          break;
    }

    var texto = $("#" + idTexto).val();
    var tabla = $("#" + idTabla);
    if(CReembolso.estatus > 1) tabla = $("#"+idOpi);
    var rem = `<button type="button" onclick="remObse(this)" class="btn btn-default
                 btn-sm pull-right" data-toggle="tooltip" title="Borrar"><i style="color: red" class="fa fa-trash-o"></i>
               </button>`;

    tabla.append(`<tr class='agobs'><td>${texto}</td><td style='5px'>${rem}</td></tr>`);
}

function remObse(fila) {
    $(fila).parents('tr').eq(0).remove();
}

function activarCambioEstatus(){

    $("#cambioestatus").show();
    $("#cambioestatusApoyo").show();
    $("#cambioestatusCarta").show();
}

function cambiarEstatusReembolso(tipo){
    var estatus = 0;
    switch (tipo){
        case "a":
            verificarAprobacion(CReembolso.numero, CReembolso.estatus, $("#lblcedula").text());
            break;
        case "r":
            verificarRechazo(CReembolso.numero, CReembolso.estatus, $("#lblcedula").text());
            break;
        case "e":
            estatus = $("#cmbcambioestatus").val();
            verificarAprobacion(CReembolso.numero, estatus, $("#lblcedula").text());
            break;
    }
}

function mostrarTextoObservacion(est){
    if(est > 1){
        $(".lblobser").text(" OPINIÓN");
        $("#cabObserbaciones").html("OPINIONES");
    }else{
        $(".lblobser").text(" OBSERVACIÓN");
        $("#cabObserbaciones").html("OBSERVACIONES");
    }
}

/** APOYO **/

function cambiarEstatusApoyo(tipo){
    var estatus = 0;
    switch (tipo){
        case "a":
            verificarAprobacionApoyo(copia.numero ,copia.estatus,$("#lblcedulaApoyo").text());
            break;
        case "r":
            verificarRechazoApoyo(copia.numero ,copia.estatus,$("#lblcedulaApoyo").text());
            break;
        case "e":
            estatus = $("#cmbcambioestatusApoyo").val();
            verificarAprobacionApoyo(copia.numero ,estatus,$("#lblcedulaApoyo").text());
            break;
    }
}

function verificarAprobacionApoyo(num, esta,id) {
    $("#_contenido").html("¿Está seguro que APROBAR el apoyo " + num + "?");
    var botones = `<button type="button" class="btn btn-success" data-dismiss="modal" id="_aceptar"
                    onClick="aprobarApoyo('${num}','${esta}','${id}')">Si</button>
                   <button type="button" class="btn btn-primary" data-dismiss="modal">No</button>`;
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}

function verificarRechazoApoyo(num, esta,id) {
    $("#_contenido").html("¿Está seguro que RECHAZAR el apoyo " + num + "?");
    var botones = `<button type="button" class="btn btn-success" data-dismiss="modal" id="_aceptar"
                    onClick="rechazarApoyo('${num}','${esta}','${id}')">Si</button>
                   <button type="button" class="btn btn-primary" data-dismiss="modal">No</button>`;
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}

function aprobarApoyo(num, est,id) {
    var url = Conn.URL + "wapoyo/estatus";
    var datos = {
      id: id,
      numero: num,
      estatus: parseInt(est) + 1
    };
    var promesa = CargarAPI({
        sURL: url,
        metodo: 'PUT',
        valores: datos,
    });
    promesa.then(function (xhRequest) {
        respuesta = JSON.parse(xhRequest.responseText);
        if(respuesta.msj == "") respuesta.msj = "Se proceso con exito....";
        $.notify(respuesta.msj, "success");
        listaBuzon(est);
    });
}

function rechazarApoyo(num, est,id) {
    var url = Conn.URL + "wapoyo/estatus";
    var datos = {
      ID: id,
      numero: num,
      estatus: -1
    };
    var promesa = CargarAPI({
        sURL: url,
        metodo: 'PUT',
        valores: datos
    });
    promesa.then(function (xhRequest) {
        respuesta = JSON.parse(xhRequest.responseText);
        if(respuesta.msj == "") respuesta.msj = "Se proceso con exito....";
        $.notify(respuesta.msj);
        listaBuzon(est);
    });

}
function crearBuzonApoyo(est){
    $("#listaApoyo").html(`<li style="background-color:#CCCCCC">
        <div class="row">
            <div class="col-sm-1"><b>Apoyo</b></div>
            <div class="col-sm-1"><b>Cedula</b></div>
            <div class="col-sm-3"><b>Nombre y Apellido</b></div>
            <div class="col-sm-1"><b>F.Solicitud</b></div>
            <div class="col-sm-2"><b>M.Solicitud</b></div>
            <div class="col-sm-2"><b>M.Aprobado</b></div>
            <div class="col-sm-1"><b>Estatus</b></div>
            </div>
        </li>`);
    lstBuzonApoyo.forEach(v => {
        $("#listaApoyo").append(CargarBuzonApoyo(v, est));
    });

}


function CargarBuzonApoyo(v, est){
  var alertSegui = "";
  switch (v.estatusseguimiento){
    case 1:
      alertSegui = '<small class="label label-danger"><i class="fa fa-info-circle"></i></small>';
      break;
    case 2:
      alertSegui = '<small class="label label-info"><i class="fa fa-comment-o"></i>Recomendacion</small>';
      break;
  }
  var fCrea = Util.ConvertirFechaHumana(v.fechacreacion);
  var montsol = numeral(parseFloat(v.montosolicitado)).format('0,0[.]00 $');
  var montapr = numeral(parseFloat(v.montoaprobado)).format('0,0[.]00 $');
  var estatus = conviertEstatus(v.estatus) + alertSegui;
  return `<li>
      <div class="row"><div class="col-sm-1"><span class="text">
        <a href="#" onclick="detalleBuzon('${v.id}','${v.numero}',${est},'A')">${v.numero}</a></span></div>
        <div class="col-sm-1"><span class="text">${v.id}</span></div>
        <div class="col-sm-3">${v.nombre}</div>
        <div class="col-sm-1">${fCrea}</div>
        <div class="col-sm-2">${montsol}</div>
        <div class="col-sm-2">${montapr}</div>
        <div class="col-sm-1">${estatus}</div>
        <div class="tools" style="margin-right: 50px;">
            <i class="fa  fa-check" title="Aceptar" style="color: green; font-size: 18px"
              onclick="verificarAprobacionApoyo('${v.numero}','${v.estatus}','${v.id}')"></i>
            <i class="fa fa-trash" title="Rechazar" style="font-size: 18px"
              onclick="verificarRechazoApoyo('${v.numero}','${v.estatus}','${v.id}')"></i>
        </div>


      </div>
  </li>`;

}

function llenarBuzonApoyo(numero,est) {
    $('#lblcedulaApoyo').text(militarActivo.Persona.DatoBasico.cedula);
    var ncompleto = militarActivo.Persona.DatoBasico.nombreprimero + " " + militarActivo.Persona.DatoBasico.apellidoprimero;
    $('#lblnombreApoyo').text(ncompleto);
    $('#lblgradoApoyo').text(militarActivo.Grado.descripcion);
    $('#lblsituacionApoyo').text(Util.ConvertirSitucacion(militarActivo.situacion));
    $('#lblnumeroApoyo').text(numero);
    $('#lblcomponenteApoyo').text(militarActivo.Componente.descripcion);

    var rutaimg = Conn.URLIMG;
    url = rutaimg + militarActivo.Persona.DatoBasico.cedula + ".jpg";
    if (militarActivo.Persona.foto != undefined) {
        rutaimg = Conn.URLTEMP;
        url = rutaimg + militarActivo.Persona.DatoBasico.cedula + "/foto.jpg";
    }
    $("#fotoperfilApoyo").attr("src", url);

    crearTablaConceptosApoyo(numero,est);

    mostrarTextoObservacion(est);

    $('#listasProgramas').hide();
    $('#detalleApoyo').show();
}

function crearTablaConceptosApoyo(numero,est){
    var fila = "";
    var pos = 0;
    var lst = militarActivo.CIS.ServicioMedico.Programa.Apoyo;
    var i = 0;
    $.each(lst, function () {
        if (this.numero == numero) {
            pos = i;
            posicionModificar = i;
        }
        i++;
    });
    copia = lst[pos];
    $("#estSeguimiento").val(copia.Seguimiento.Estatus);
    if(est > 2){
        activarCambioEstatus("apoyo");
    }
    $("#cuerpoEditarConceptosApoyo").html('');
    copia.Concepto.forEach(v => {
        var mntApo = 0;
        if(v.DatoFactura.montoaprobado > 0) mntApo = v.DatoFactura.montoaprobado;
        var ffact = Util.ConvertirFechaHumana(v.DatoFactura.fecha);
        var picar = v.afiliado.split("-");
        var picar2 = picar[1].split("(");
        var tam = picar2[1].length;
        var parent = picar2[1].substr(0,tam-1);
        var nombre = picar[0];
        var cedula = picar2[0];
        var fecha = Util.ConvertirFechaHumana(v.DatoFactura.fecha);
        $("#cuerpoEditarConceptosApoyo").append(fila);
        fila = `<tr>
                    <td>${parent}</td>
                    <td>${nombre}</td>
                    <td>${cedula}</td>
                    <td>${v.descripcion}</td>
                    <td><input type="text" style="width: 100%" value="${v.DatoFactura.numero}" class="numfact"></td>
                    <td style="display: none">${v.DatoFactura.Beneficiario.rif}</td>
                    <td style="display: none">${v.DatoFactura.Beneficiario.razonsocial}</td>
                    <td><input type="text" style="width: 100%" class="ffactApoyo" value="${fecha}"></input></td>
                    <td><input type="text" onblur="calcularPorcen(this,'a')" class="mntsoli"
                        onkeypress="return Util.SoloNumero(event,this,true)" value="${v.DatoFactura.monto}"/></td>
                        <td><input type="text" onblur="calcularPorcen(this,'a')"  class="mntacubrir"
                        onkeypress="return Util.SoloNumero(event,this,true)" style="width: 100%" value="${v.montoaseguradora}" /></td>
                        <td><input type="text" style="width: 100%" onblur="calcularPorcen(this,'a')"  class="mntacubrir"
                        onkeypress="return Util.SoloNumero(event,this,true)" value="${v.montoaportar}" ></td>
                     <td><input type="text" value="${copia.montosolicitado}" class="mntAcumulado"
                        onkeypress="return Util.SoloNumero(event,this,true)" onblur="calcularAcumulado('a')"></td>
                    <td style="width: 7%;">
                    <button type="button" class="btn btn-default btn-sm borrarconcepto" title="Eliminar">
                    <i class="fa fa-trash-o" style="color: red;"></i></button>
                    </td>
                </tr>`;
        $("#cuerpoEditarConceptosApoyo").append(fila);
    });
   // $("#totalterApoyo").html(copia.montosolicitado.toFixed(2));
    $("#totalaproApoyo").html(copia.montoaprobado);
    $(".borrarconcepto").click(function () {
        $(this).parents('tr').eq(0).remove();
        if ($("#cuerpoEditarConceptosApoyo tr").length == 0) {

        }
        calcularAcumulado("apoyo");
    });
    $(".mntsoli").on("keypress",function(e){
        var key = e.keyCode || e.which;
        if(key == 13){
            calcularPorcen(this,'a');
        }
    });
    $(".porcentajecalculo").on("keypress",function(e){
        var key = e.keyCode || e.which;
        if(key == 13){
            calcularPorcen(this,'a');
        }
    });

    /**
     * Crear tabla de objservaciones
     */
    if (copia.Seguimiento.Observaciones != undefined) {
        var lstObs = copia.Seguimiento.Observaciones;
        $("#cuerpoObservacionesApoyo").html('');
        $("#cuerpoOpinionesApoyo").html('');
        $.each(lstObs, function () {
            var tipo = this.contenido.split("|||");
            if(tipo[1] != undefined) $("#cuerpoOpinionesApoyo").append('<tr><td>' + tipo[0] + '</td><td>'+conviertEstatus(copia.estatus)+'</td></tr>');
            else $("#cuerpoObservacionesApoyo").append('<tr><td>' + this.contenido + '</td><td></td></tr>');
        });
    }
    activarCambioEstatus();
}

function planillaReembolso(){
    var ventana = window.open("planillaReembolso.html?id="+militarActivo.Persona.DatoBasico.cedula+"&pos="+posicionModificar, "_blank");
}

function actualizarApoyo(est) {
    var conceptos = new Array();
    var datos = null;
    var i = 0;
    if ($("#cuerpoEditarConceptosApoyo tr").length > 0) {
        $("#cuerpoEditarConceptosApoyo tr").each(function () {
            var concep = new ConceptoApoyo();
            var facturaD = new Factura();
            var ffact = copia.fechacreacion;
            if ($(this).find("input.ffactApoyo").eq(0).val() != "") {
                ffact = new Date(Util.ConvertirFechaUnix($(this).find("input.ffactApoyo").val())).toISOString();
            }
            facturaD.fecha = ffact;
            facturaD.monto = parseFloat($(this).find("input.mntsoli").val());
            facturaD.montoaprobado = parseFloat($(this).find("input.mntAcumulado").val());
            facturaD.numero = $(this).find("input.numfact").val();
            facturaD.control = $(this).find("input.numfact").val();

            facturaD.Beneficiario = copia.Concepto[i].DatoFactura.Beneficiario;

            concep.DatoFactura = facturaD;
            concep.afiliado = copia.Concepto[i].afiliado;
            concep.descripcion = copia.Concepto[i].descripcion;
            concep.montoaportar = parseFloat($("#totalterApoyo").html());
            i++;
            conceptos.push(concep);
        });

        copia.Concepto = conceptos;
    } else {
        $.notify("Debe poseer al menos un concpeto para editar. O puede rechazar el reembolso");
    }

    copia.montoaprobado = parseFloat($("#totalaproApoyo").html());
    copia.montosolicitado = parseFloat($("#totalterApoyo").html());
    var obseraciones = new Array();
    var tipoObser = "";
    if(copia.estatus > 1) tipoObser = "|||"+copia.estatus;
    if($("#cuerpoObservacionesApoyo tr").length > 0){
        $("#cuerpoObservacionesApoyo tr.agobs").each(function(){
            obseraciones.push($(this).find("td").eq(0).html());
        });
    }
    if($("#cuerpoOpinionesApoyo tr").length > 0){
        $("#cuerpoOpinionesApoyo tr.agobs").each(function(){
            obseraciones.push($(this).find("td").eq(0).html()+tipoObser);
        });
    }
    copia.Seguimiento.Estatus = parseInt($("#estSeguimientoApoyo").val());

    datos = {id: militarActivo.Persona.DatoBasico.cedula, numero: copia.numero, Apoyo: copia,Posicion:posicionModificar,Observaciones:obseraciones};

    var urlGuardar = Conn.URL + "wapoyo";
    var request2 = CargarAPI({
        sURL: urlGuardar,
        metodo: 'PUT',
        valores: datos,
    });

    request2.then(function(xhRequest) {
        respuesta = JSON.parse(xhRequest.responseText);
        if(respuesta.msj == "") respuesta.msj = "Se proceso con exito....";
        msjRespuesta(respuesta.msj);
        listaBuzon(copia.estatus);
        volverLista();
    });
}


/**CARTA AVAL***/
function crearBuzonCarta(est) {
    console.log('Cargando el buzon de Carta Aval...');
    $("#listaCarta").html(`<li style="background-color:#CCCCCC">
        <div class="row">
            <div class="col-sm-1"><b>Carta</b></div>
            <div class="col-sm-1"><b>Cedula</b></div>
            <div class="col-sm-3"><b>Nombre y Apellido</b></div>
            <div class="col-sm-1"><b>F.Solicitud</b></div>
            <div class="col-sm-2"><b>M.Solicitud</b></div>
            <div class="col-sm-2"><b>M.Aprobado</b></div>
            <div class="col-sm-1"><b>Estatus</b></div>
        </div>
    </li>`);

    $.each(lstBuzonCarta, function () {
        var alertSegui = "";
        switch (this.estatusseguimiento){
            case 1:
                alertSegui = '<small class="label label-danger"><i class="fa fa-info-circle"></i>Pendientes</small>';
                break;
            case 2:
                alertSegui = '<small class="label label-info"><i class="fa fa-comment-o"></i>Recomendacion</small>';
                break;
        }
        var item = '<li><div class="row"><div class="col-sm-1"><span class="text"><a href="#" onclick="detalleBuzon(\'' + this.id + '\',\'' + this.numero + '\','+est+',\'C\')"> ' + this.numero + '</a></span></div>\n' +
            '                <div class="col-sm-1"><span class="text">' + this.id + '</span></div>\n' +
            '                <div class="col-sm-3">' + this.nombre + '</div>\n' +
            '                <div class="col-sm-1">' + Util.ConvertirFechaHumana(this.fechacreacion) + '</div>\n' +
            '                <div class="col-sm-2">' + numeral(parseFloat(this.montosolicitado)).format('0,0[.]00 $') + '</div>\n' +
            '                <div class="col-sm-2">' + numeral(parseFloat(this.montoaprobado)).format('0,0[.]00 $') + '</div>\n' +
            '                <div class="col-sm-1">' + conviertEstatus(this.estatus)+alertSegui + '</div>\n' +
            '                <div class="tools" style="margin-right: 50px;">\n' +
            '                    <i class="fa  fa-check-square" style="color: green" onclick="verificarAprobacion(\'' + this.numero + '\',\'' + this.estatus + '\',\''+this.id+'\')"></i>\n' +
            '                    <i class="fa fa-trash-o" onclick="verificarRechazo(\'' + this.numero + '\',\'' + this.estatus + '\',\''+this.id+'\')"></i>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </li>';
        $("#listaCarta").append(item);
    });
}

function llenarBuzonCarta(numero,est) {

    $('#lblcedulaCarta').text(militarActivo.Persona.DatoBasico.cedula);
    var ncompleto = militarActivo.Persona.DatoBasico.nombreprimero + " " + militarActivo.Persona.DatoBasico.apellidoprimero;
    $('#lblnombreCarta').text(ncompleto);
    $('#lblgradoCarta').text(militarActivo.Grado.descripcion);
    $('#lblsituacionCarta').text(Util.ConvertirSitucacion(militarActivo.situacion));
    $('#lblnumeroCarta').text(numero);
    $('#lblcomponenteCarta').text(militarActivo.Componente.descripcion);

    var rutaimg = Conn.URLIMG;
    url = rutaimg + militarActivo.Persona.DatoBasico.cedula + ".jpg";
    if (militarActivo.Persona.foto != undefined) {
        rutaimg = Conn.URLTEMP;
        url = rutaimg + militarActivo.Persona.DatoBasico.cedula + "/foto.jpg";
    }
    $("#fotoperfilCarta").attr("src", url);

    crearTablaConceptosCarta(numero,est);

    mostrarTextoObservacion(est);

    $('#listasProgramas').hide();
    $('#detalleCarta').show();
}

function crearTablaConceptosCarta(numero,est){
    var fila = "";
    var pos = 0;

    var lst = militarActivo.CIS.ServicioMedico.Programa.CartaAval;
    var i = 0;
    $.each(lst, function () {
        if (this.numero == numero) {
            pos = i;
            posicionModificar = i;
        }
        i++;
    });
    copia = lst[pos];
    $("#estSeguimientoCarta").val(copia.Seguimiento.Estatus);
    if(est > 2){
        activarCambioEstatus("carta");
    }
    $("#cuerpoEditarConceptosCarta").html('');
    copia.Concepto.forEach(v => {
        var mntApo = v.DatoFactura.monto;
        if(v.DatoFactura.montoaprobado > 0) mntApo = v.DatoFactura.montoaprobado;

        fila = `<tr>
              <td>${v.afiliado}</td>
              <td>${v.descripcion}</td>
              <td>${v.DatoFactura.Beneficiario.rif}</td>
              <td style="display: none">${v.DatoFactura.Beneficiario.razonsocial}</td>
              <td>${v.DatoFactura.monto}</td>
              <td><input type="text" value="${v.montoaseguradora}" class="numfact"></td>
              <td class="mntsoli">${v.montoaportar}</td>
              <td>
                <input type="text" value="${vmntApo}" class="mntAcumulado" onkeypress="return Util.SoloNumero(event,this,true)" onblur="calcularAcumulado()">
              </td>
              <td style="width: 7%;">
                <button type="button" class="btn btn-default btn-sm borrarconcepto" title="Eliminar"><i class="fa fa-trash-o" style="color: red;"></i></button>
              </td>
            </tr>`;
        $("#cuerpoEditarConceptosCarta").append(fila);
    });
    $("#totalterCarta").html(copia.montosolicitado.toFixed(2));
    $("#totalaproCarta").html(copia.montoaprobado);
    $(".borrarconcepto").click(function () {
        $(this).parents('tr').eq(0).remove();
        if ($("#cuerpoEditarConceptosCarta tr").length == 0) {

        }
        calcularAcumulado("carta");
    });

    /**
     * Crear tabla de objservaciones
     */
    if (copia.Seguimiento.Observaciones != undefined) {
        var lstObs = copia.Seguimiento.Observaciones;
        $("#cuerpoObservacionesCarta").html('');
        $("#cuerpoOpinionesCarta").html('');
        $.each(lstObs, function () {
            var tipo = this.contenido.split("|||");
            if(tipo[1] != undefined) $("#cuerpoOpinionesCarta").append('<tr><td>' + tipo[0] + '</td><td>'+conviertEstatus(copia.estatus)+'</td></tr>');
            else $("#cuerpoObservacionesCarta").append('<tr><td>' + this.contenido + '</td><td></td></tr>');
        });
    }
}

function validarDetalleReembolso(est){
    switch (est){
        case 0:
            $(".porcentajecalculo").attr("disabled",true);
            $(".mntAcumulado").attr("disabled",true);
            $(".impPlanillaReembolso").hide();
            break;
        case 1:
            $(".porcentajecalculo").attr("disabled",false);
            $(".mntAcumulado").attr("disabled",false);
            $(".impPlanillaReembolso").show();
            break;
        case 2:
            $(".porcentajecalculo").attr("disabled",false);
            $(".mntAcumulado").attr("disabled",false);
            $(".impPlanillaReembolso").show();
            break;
        case 3:
            $(".porcentajecalculo").attr("disabled",false);
            $(".mntAcumulado").attr("disabled",false);
            $(".impPlanillaReembolso").show();
            break;
        case 4:
            $(".porcentajecalculo").attr("disabled",false);
            $(".mntAcumulado").attr("disabled",false);
            $(".impPlanillaReembolso").show();
            break;
        case 5:
            $(".porcentajecalculo").attr("disabled",false);
            $(".mntAcumulado").attr("disabled",false);
            $(".impPlanillaReembolso").show();
            break;
    }
}
