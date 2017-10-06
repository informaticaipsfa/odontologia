class Utilidad {
    constructor() {

    }

    Especiales(e,elemento) {
        var key = e.keyCode || e.which;
        var tecla = String.fromCharCode(key).toLowerCase();
        var letras = " áéíóúabcdefghijklmnñopqrstuvwxyz0123456789*";
        var especiales = [8, 37, 39, 46, 9, 17];

        var tecla_especial = false
        for (var i in especiales) {
            if (key == especiales[i]) {
                tecla_especial = true;
                break;
            }
        }

        if (letras.indexOf(tecla) == -1 && !tecla_especial) {
            $.notify("("+tecla+") Caracter no permitido", "warning");
            return false;
        }
        return true;
    }

    cmbField(obj,foco){
        var id = obj.id;
        if(foco){
            $("#"+id).attr("type","text");
            $("#"+id).val("");
        }else{
            $("#"+id).attr("type","password");
        }

    }

    SoloLetras(e) {
        var key = e.keyCode || e.which;
        var tecla = String.fromCharCode(key).toLowerCase();
        var letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
        var especiales = [8, 37, 39, 46];

        var tecla_especial = false
        for(var i in especiales) {
            if(key == especiales[i]) {
                tecla_especial = true;
                break;
            }
        }
        if(letras.indexOf(tecla) == -1 && !tecla_especial){


            return false;
        }

           return true;
    }

    SoloNumero(event,elemento,monto) {
        var key = event.keyCode || event.which;
        var tecla = String.fromCharCode(key).toLowerCase();
        var numeros = "0123456789";
        var especiales = [8, 37, 39, 13, 9];
        if(monto == true) especiales.push(46);
        if(key == 46){
            if(elemento.value.indexOf(".") != -1 || elemento.value == ""){
                return false;
            }
        }

        var tecla_especial = false
        for (var i in especiales) {
            if (key == especiales[i]) {
                tecla_especial = true;
                break;
            }
        }

        if (numeros.indexOf(tecla) == -1 && !tecla_especial) {
            return false;
        }
        return true;
    }

    //Recibe  Fecha Formato: AAAA-MM-DD 00:00:00
    //Retorna Fecha Formato: DD/MM/AAAA
    ConvertirFechaHumana(f,formato) {
        var ISODate = new Date(f).toISOString();
        var fe = ISODate.substr(0, 10);
        var fa = fe.split("-");
        if (fa[0] != "0001") {
            if(formato != null){
                return fa[0] + "/" + fa[1] + "/" + fa[2];
            }
            return fa[2] + "/" + fa[1] + "/" + fa[0];
        } else {
            return "";
        }
        //return fa[2] + "/" + fa[1] + "/" + fa[0];
    }

    ConvertirFechaActual() {
        var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
        var f = new Date();

        return f.getDate() + " del mes de " + meses[f.getMonth()] + " de " + f.getFullYear();
    }


    //Recibe  Fecha Formato: DD/MM/AAAA
    //Retorna Fecha Formato: AAAA-MM-DD
    ConvertirFechaUnix(f) {
        var fecha = f.split("/");
        return fecha[2] + "-" + fecha[1] + "-" + fecha[0];
    }


    ValidarFormulario(_frm,ele) {

        let respuesta = true;
        $("#" + _frm + " :input").each(function (i) {
            var valor = $(this).val();
            var dis = $(this).attr('required');
            var id = $(this).attr('id');
            if (dis == "required") {
                if (valor == "") {
                    respuesta = false;
                }
            }
        });

        $("#" + _frm + " select").each(function (i) {
            var valor = $(this).val();
            var dis = $(this).attr('required');
            var id = $(this).attr('id');
            if (dis == "required") {
                if (valor == "S") {
                    respuesta = false;
                }
            }
        });
        if(respuesta) return respuesta;
        else return this.MensajeFormulario(_frm,ele);
    }

    MensajeFormulario(_frm,ele) {

        $("#" + _frm + " :input").each(function (i) {
            var valor = $(this).val();
            var dis = $(this).attr('required');
            var id = $(this).attr('id');

            if (dis == "required") {
                if (valor == "") {
                    $(this).notify("*");
                }
            }
        });

        $("#" + _frm + " select").each(function (i) {
            var valor = $(this).val();
            var dis = $(this).attr('required');
            var id = $(this).attr('id');

            if (dis == "required") {
                if (valor == "S" || valor == "") {
                    $("#select2-"+this.id+"-container").notify("*",{position:"top left"})
                    $(this).notify("*");

                }
            }
        });
        $("#"+ele).notify("Recuerde de ingresar todos los campos requeridos","warn");
        return false;
    }

    //
    CalcularEdad(fecha) {
        var FechaActual = new Date(Date.now());
        var AnnoA = parseInt(FechaActual.getFullYear());
        var MesA = parseInt(FechaActual.getMonth()) + 1;
        var DiaA = parseInt(FechaActual.getDate());

        var f = fecha.split("/");

        var AnoN = parseInt(f[2]);
        var MesN = parseInt(f[1]);
        var DiaM = parseInt(f[0]);

        var Ano = AnnoA - AnoN;

        var Mes = MesA - MesN;
        var Dia = DiaA - DiaM;
        if (Dia < 0) {
            Dia = 0;
            Mes++;
        }
        if (Mes <= 0) {
            Ano--;
        } else {
            Ano;
        }

        return Ano;
    }


    ConvertirParentesco(cad,sexo){
        var parent = "";
        switch(cad) {
            case "PD":
                parent =(sexo=="F")?"MADRE":"PADRE";
                break;
            case "HJ":
                parent = (sexo=="F")?"HIJA":"HIJO";
                break;
            case "EA":
                parent = (sexo=="F")?"ESPOSA":"ESPOSO";
                break;
          case "VI":
              parent = (sexo=="F")?"VIUDA":"VIUDO";
              break;
            default:
                parent = "";
                break;
        }
        return parent;
    }

    ConvertirSitucacion(sit){
        var situacion = "";
        switch (sit){
            case "ACT":
                situacion = "ACTIVO";
                break;
            case "RCP":
                situacion = "RESERVA ACTIVA";
                break;
            case "RSP":
                situacion = "RETIRADO";
                break;
            case "FCP":
                situacion = "FALLECIDO CON PENSION";
                break;
            case "FSP":
                situacion = "FALLECIDO SIN PENSION";
                break;
            case "I":
                situacion = "INVALIDO";
                break;
            case "D":
                situacion = "DISPONIBLE";
                break;
        }
        return situacion;
    }

    ConvertirBanco(ban){
        var banco = "";
        switch (ban){
            case "0156":banco = "100%BANCO";break;
            case "0196":banco = "ABN AMRO BANK";break;
            case "0172":banco = "BANCAMIGA BANCO MICROFINANCIERO, C.A.";break;
            case "0171":banco = "BANCO ACTIVO BANCO COMERCIAL, C.A.";break;
            case "0166":banco = "BANCO AGRICOLA";break;
            case "0175":banco = "BANCO BICENTENARIO";break;
            case "0128":banco = "BANCO CARONI, C.A. BANCO UNIVERSAL";break;
            case "0164":banco = "BANCO DE DESARROLLO DEL MICROEMPRESARIO";break;
            case "0102":banco = "BANCO DE VENEZUELA S.A.I.C.A.";break;
            case "0128":banco = "BANCO CARONI, C.A. BANCO UNIVERSAL";break;
            case "0114":banco = "BANCO DEL CARIBE C.A.";break;
            case "0149":banco = "BANCO DEL PUEBLO SOBERANO C.A.";break;
            case "0163":banco = "BANCO CARONI, C.A. BANCO UNIVERSAL";break;
            case "0176":banco = "BANCO ESPIRITUD SANTO C.A.";break;
            case "0115":banco = "BANCO EXTERIOR C.A.";break;
            case "0003":banco = "BANCO INDUSTRIAL DE VENEZUELA";break;
            case "0173":banco = "BANCO INTERNACIONAL DE DESARROLLO, C.A.";break;
            case "0105":banco = "BANCO MERCANTIL, C.A.";break;
            case "0191":banco = "BANCO NACIONAL DE CREDITO";break;
            case "0116":banco = "BANCO OCCIDENTAL DE DESCUENTO.";break;
            case "0138":banco = "BANCO PLAZA";break;
            case "0108":banco = "BANCO PROVINCIAL BBVA";break;
            case "0104":banco = "BANCO VENEZOLANO DE CREDITO S.A.";break;
            case "0168":banco = "BANCRECER S.A. BANCO DE DESARROLLO";break;
            case "0134":banco = "BANESCO BANCO UNIVERSAL";break;
            case "0177":banco = "BANFANB";break;
            case "0146":banco = "BANGENTE";break;
            case "0174":banco = "BANPLUS BANCO COMERCIAL C.A";break;
            case "0190":banco = "CITIBANK.";break;
            case "0121":banco = "CORP BANCA.";break;
            case "0157":banco = "DELSUR BANCO UNIVERSAL";break;
            case "0151":banco = "FONDO COMUN";break;case "0601":banco = "INSTITUTO MUNICIPAL DE CRÉDITO POPULAR";break;
            case "0169":banco = "MIBANCO BANCO DE DESARROLLO, C.A.";break;
            case "0137":banco = "SOFITASA";break;
        }
        return banco;
    }


    //Obtener la direccion mac
    ObtenerMAC(MAC) {
        //en construccion
    }

    //Obtener la direccion ip
    ObtenerIP(IP) {
        //en construccion
    }

    //Cargar imagenes desde archivos
    CargarIMG(DIV, URL) {

    }

    GenerarEstadoCivil(est,sexo){
        var estadocivil;
        switch(est) {
            case "C":
                estadocivil =(sexo=="F")?"CASADA":"CASADO";
                break;
            case "D":
                estadocivil = (sexo=="F")?"DIVORCIADA":"DIVORCIADO";
                break;
            case "S":
                estadocivil = (sexo=="F")?"SOLTERA":"SOLTERO";
                break;
            case "V":
                estadocivil = (sexo=="F")?"VIUDA":"VIUDO";
                break;
            default:
                estadocivil = "";
                break;
        }
        return estadocivil;
    }

    ValidarCorreo(id) {
        var email = $('#'+id).val();
        var caracter = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);

        if (!caracter.test(email)) {
            $.notify($('#'+id), "Formato de correo invalido", {position: "top"});
            return false;
        } else {
            return true;
        }
    }
}
