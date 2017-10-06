let Util = new Utilidad();

class CuentaBancaria2 {
    constructor() {
        console.log('Creando cuenta Bancaria');
        this.tipo = "";
        this.institucion = "";
        this.cuenta = "";
        this.titular = '';
        this.cedula = '';
    }
}

class Beneficiario {
    constructor() {
        console.log('Creando objeto Beneficiario');
        this.rif = '';
        this.razonsocial = '';
        this.tipo = '';
        this.direccion = '';
        //this.Banco = new CuentaBancaria2();
    }
}

class Factura {
    constructor() {
        console.log("Creando objeto Factura");
        this.numero = '';
        this.control = '';
        this.fecha = '';
        this.monto = 0.00;
        this.montoaprobado= 0.00;
        this.porcentaje = 0.00;
        this.montootroaporte = 0.00;
        this.Beneficiario = new Beneficiario();
    }
}


class ConceptoReembolso {
    constructor() {
        console.log("Creando objeto ConceptoReembolso");
        this.descripcion = '';
        this.DatoFactura = new Factura();
        this.afiliado = '';
        this.requisito = new Array();
    }
}

class ConceptoApoyo {
    constructor() {
        console.log("Creando objeto ConceptoAyuda");
        this.descripcion = '';
        this.DatoFactura = new Factura();
        this.afiliado = '';
        this.patologia = "";
        this.montoaseguradora = 0.00;
        this.montoaportar = 0.00;
        this.requisito = new Array();
    }
}

class Seguimiento{
    constructor(){
        this.Estatus = 0;
        this.Observaciones = new Array();
    }
}

class Reembolso {
    constructor() {
        console.log("Creando objeto Reembolso");
        this.estatus = 0;
        this.montosolicitado = 0.00;
        //this.numero = '';
        //this.fechacreacion = '';
        //this.responsable = '';
        this.cuentabancaria = new CuentaBancaria2();
        this.Concepto = new Array();
        this.montoaprobado = 0.00;
        this.fechaaprobacion = '';
        this.requisito = new Array();
        this.observaciones = "";
        this.Direccion = new Direccion();
        this.Telefono = new Telefono();
        this.Correo = new Correo();
        this.Seguimiento = new Seguimiento();
    }
}

class Apoyo {
    constructor() {
        console.log("Creando objeto apoyo");
        this.estatus = 0;
        this.montosolicitado = 0.00;
        this.cuentabancaria = new CuentaBancaria2();
        this.Concepto = new Array();
        this.montoaprobado = 0.00;
        this.fechaaprobacion = '';
        this.requisito = new Array();
        this.observaciones = "";
        this.Direccion = new Direccion();
        this.Telefono = new Telefono();
        this.Correo = new Correo();
        this.Seguimiento = new Seguimiento();
        this.tipo = 0;
        this.convenio = "";
    }
}


class Programa {
    constructor() {
        console.log("Creando objeto Programa");
        this.Apoyo = new Array();
        this.Reembolso = new Array();
        this.CartaAval = new Array();
        this.Farmacia = new Array();
    }
}

class ServicioMedico {
    constructor() {
        console.log("Creando objeto ServicoMedico");
        this.Programa = new Array();
    }
}

class CIS {
    constructor() {
        console.log("Creando objeto CIS");
        this.ServicioMedico = new Array();
        this.Gasto = new Array();
        this.Equipomedico = new Array();
    }
}

class Estado{
    constructor() {

    }
    Crear(Json) {
        if (sessionStorage.getItem('ipsfaEstado') == undefined ){
            sessionStorage.setItem('ipsfaEstado', JSON.stringify(Json));
        }
    }
    ObtenerEstados(){
        let estado = JSON.parse(sessionStorage.getItem('ipsfaEstado'));

        $("#cmbmestado").html('<option value="S" selected="selected"></option>');
        $("#cmbestadof").html('<option value="S" selected="selected"></option>');
        $.each(estado, function (c, v){
            $("#cmbmestado").append('<option value="' + v.codigo + '">' + v.nombre + '</option>');
            $("#cmbestadof").append('<option value="' + v.codigo + '">' + v.nombre + '</option>');
        });

    }
    ObtenerCiudadMunicipio(estado, nombre){
        var sciudad = 'cmbmciudad';
        var smunicipio = 'cmbmmunicipio';
        if ( nombre != undefined){
            sciudad = 'cmbciudadf';
            smunicipio = 'cmbmunicipiof';
        }
        var cm = JSON.parse(sessionStorage.getItem('ipsfaEstado')); //CiudadMunicipio
        $.each(cm, function(c, v){
            if (v.codigo == estado){

                let ciudad = v.ciudad;
                let municipio = v.municipio;
                $("#" + sciudad).html('<option value="S" selected="selected"></option>');
                $("#" + smunicipio).html('<option value="S" selected="selected"></option>');
                $.each(ciudad, function (c,v){
                    $("#" + sciudad).append('<option value="' + v.nombre + '">' + v.nombre + '</option>');
                });
                $.each(municipio, function (c,v){
                    $("#" + smunicipio).append('<option value="' + v.nombre + '">' + v.nombre + '</option>');
                });
            }
        });
    }
    ObtenerParroquia(estado, municipio, nombre){
        var sparroquia = 'cmbmparroquia';
        if ( nombre != undefined){
            sparroquia = 'cmbparroquiaf';
        }
        var cm = JSON.parse(sessionStorage.getItem('ipsfaEstado')); //CiudadMunicipio
        $.each(cm, function(c, v){
            if (v.codigo == estado){
                var mun = v.municipio;
                $.each(mun, function (c,v){
                    if(v.nombre == municipio){
                        $("#" + sparroquia).html('<option value="S"></option>');
                        $.each(v.parroquia, function(cl, vl){
                            $("#" + sparroquia).append('<option value="' + vl + '">' + vl + '</option>');
                        });
                    }
                });
            }
        });
    }
}

var Conn = new Conexion();
var Estados = new Estado();
$(function () {


  var requestE = CargarAPI({
      sURL: Conn.URL + "estado",
      metodo: 'GET',
      valores: '',
  });
  requestE.then(function(xhRequest) {
      Estados.Crear(JSON.parse(xhRequest.responseText));
  });
  CargarUrl("opciones","modulo_atencion");
  CargarUrl("_bxBuscar", "buscar");
  CargarUrl("_bxMedico", "inc/medico");
  CargarUrl("panelperfil", "inc/perfil");
  CargarUrl("panellista", "inc/lstReembolsos");
  CargarUrl("panelentrada", "inc/opcionesPrograma");
  numeral.register('locale', 'es-es', {
      delimiters: {
          thousands: '.',
          decimal: ','
      },
      abbreviations: {
          thousand: 'k',
          million: 'mm',
          billion: 'b',
          trillion: 't'
      },
      ordinal: function (number) {
          var b = number % 10;
          return (b === 1 || b === 3) ? 'er' :
              (b === 2) ? 'do' :
                  (b === 7 || b === 0) ? 'mo' :
                      (b === 8) ? 'vo' :
                          (b === 9) ? 'no' : 'to';
      },
      currency: {
          symbol: 'Bs'
      }
  });
  numeral.locale('es-es');

});

function CiudadMunicipio(valor){
    if (valor == undefined){
        Estados.ObtenerCiudadMunicipio($("#cmbmestado option:selected").val());
    }else{
        Estados.ObtenerCiudadMunicipio($("#cmbestadof option:selected").val(), true);
    }
}
function SeleccionarParroquia(valor){
    if (valor == undefined){
        Estados.ObtenerParroquia($("#cmbmestado option:selected").val(), $("#cmbmmunicipio option:selected").val());
    }else{
        Estados.ObtenerParroquia($("#cmbestadof option:selected").val(), $("#cmbmunicipiof option:selected").val(), true);
    }
}

function buzon(est){
    CargarUrl("panelderecho","inc/buzon");
    listaBuzon(est);
}

function msjRespuesta(texto) {
    $("#_contenido").html(texto);
    var botones = '<a type="button" href="starter.html" class="btn btn-primary">Continuar</a>';
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}

function msj2Respuesta(texto) {
    $("#_contenido").html(texto);
    var botones = '<a type="button" href="starter.html" class="btn btn-primary">Continuar</a>';
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}

function msjferespuesta(texto) {
    $("#_contenido").html("El militar se encuentra Activo.");
    var botones = '<a type="button" href="starter.html" class="btn btn-primary">Continuar</a>';
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}

function Principal(){

}

function PanelEntrada(){
  $("#opciones").show();
  $("#panelentrada").hide();
  $("#panellista").hide();
  $("#panelregistro").hide();
}

function PanelOpciones(){
  $("#opciones").hide();
  $("#panelentrada").show();
  $("#panellista").hide();
  $("#panelregistro").hide();
  $("#panelperfil").show();
}

function PanelListadoDetallado(){
  $("#tblTodos").show();
  $("#tblreembolsos").slideDown();
  $("#tblapoyos").slideDown();
  $("#tblcartas").slideDown();
  $("#lstDetalle").hide();
  $("#lstDetalleApoyo").hide();
  $("#lstDetalleCarta").hide();
}

function ConsultarID(e){
  if (e.keyCode == 13) {
      Buscar();
  }
}
