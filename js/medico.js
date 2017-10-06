

$(function () {
    $("#concepto").select2();

    $(".mdl-requisitos").on("change", function () {
        verificaCheckModal("requisitos", "btnGenerar");
    });

    $(".mdl-requisitosodon").on("change", function () {
        verificaCheckModal("requisitosodon", "btnGenerar");
    });

    $(".mdl-requisitosmonto").on("change", function () {
        verificaCheckModal("requisitosmonto", "btnGenerar");
    });

    llenarApoyo();
    $(".btnvolverentrada").click(function () {
        $("#mdldesea").modal("show");

        $("#btnsalir").click(function () {
            $("#opciones").hide();
            $("#panelentrada").show();
            $("#panellista").hide();
            $("#panelregistro").hide();
            $('#mdldesea').modal('hide');
            limpiarApoyo();
            limpiarmdlempresa();
            $("#rifnuevo").remove();
            $("#sefue").remove();
        })
    });
    $(".btncancelarapo").click(function () {
        limpiarmdlempresa();
        $("#rifnuevo").remove();
        $("#sefue").remove();
    });
    $(".close").click(function () {
        limpiarmdlempresa();
        $("#rifnuevo").remove();
        $("#sefue").remove();
    });
    $(".btnguardar").click(function () {
        limpiarmdlempresa();
        $("#rifnuevo").remove();
        $("#sefue").remove();
    });
});

function consultarRif() {
    var rif = $("#rif").val();
    var rz = '';
    var encontrado = 0;
    $.each(lstProveedores, function () {
        if (this.rif == rif) {
            rz = this.razonsocial;
            encontrado = 1;
        }
    });
    if (encontrado == 1) {
        $("#razonsocial").val(rz);
    } else {
        $("#mdlEmpresaapo").modal("show");
        var modalemp = "";
        modalemp = `<label id="sefue">Rif:</label>\n<input class="form-control" id="rifnuevo" value="${rif}" required="required">`;
        $("#rifnuevo2").append(modalemp);
    }
}

function salvarEmpresa() {
    var rifn = $("#rifnuevo").val();
    var rznuevo = $("#rsocialnuevo").val();
    var tenuevo = $("#tipoenuevo").val();
    var direc = $("#direcnueva").val();
    var cuenta = $("#numerocuentanueva").val();
    var banco = $("#_cmbmtipofinanciera option:selected").val();
    var tipoc = $("#_cmbmtipocuentaranueva option:selected").val();
    if (rifn == "" || rznuevo == "" || tenuevo == "S" || direc == "" || cuenta == "" || banco == "S" || tipoc == "S") {
        alert(rifn + "**" + rznuevo + "**" + tenuevo + "**" + direc + "**" + cuenta + "**" + banco + "**" + tipoc)
        $.notify("Debe ingresar todos los datos de la empresa a registrar");
        return false;
    }
    $.notify("Proceso de registro pendiente");
    $("#rif").val(rifn);
    $("#razonsocial").val(rznuevo);
    limpiarmdlempresa();
    $("#emptipo").val(tenuevo);
    $("#empdirec").val(direc);
    $("#empcuenta").val(cuenta);
    $("#empbanco").val(banco);
    $("#emptipoc").val(tipoc);
    $("#mdlEmpresaapo").modal('hide');
}

function llenarApoyo() {
    $("#cmbbeneficiario").html('<option selected="selected" value="S"></option>');
    $("#datosbancarios").html('<option selected="selected" value="S">Escoja</option>');
    $("#_cargando").hide();
    if (militar.Persona != undefined) {
        $("#cuerporeembolsos").html("");
        var ncompleto = militar.Persona.DatoBasico.nombreprimero + " " + militar.Persona.DatoBasico.apellidoprimero;
        $("#txtnombre").val(militar.Persona.DatoBasico.nombreprimero);
        $("#txtapellido").val(militar.Persona.DatoBasico.apellidoprimero);
        $("#ttnombre").text(ncompleto);


        $("#cmbcomponente").val(militar.Componente.descripcion);
        $("#ttcomponente").text(militar.Componente.descripcion);

        $("#cmbgrado").val(militar.Grado.descripcion)
        $("#ttgrado").text(militar.Grado.descripcion);

        $("#txtcedula").val(militar.Persona.DatoBasico.cedula);
        $("#ttcedula").text(militar.Persona.DatoBasico.cedula);

        crearLista();

        var estcivil = Util.GenerarEstadoCivil(militar.Persona.DatoBasico.estadocivil, militar.Persona.DatoBasico.sexo);

        $("#cmbedocivil").val(estcivil);
        $("#ttestadocivil").text(estcivil);

        $("#cmbsituacion").val(militar.situacion);
        $("#ttsituacion").text(Util.ConvertirSitucacion(militar.situacion));

        if (militar.Persona.Telefono != undefined) {
            $("#txtmtelefono").val(militar.Persona.Telefono.domiciliario);
            $("#txtmcelular").val(militar.Persona.Telefono.movil);
            $("#txtmcorreo").val(militar.Persona.Correo.principal);
        }

        if (militar.Persona.DatoFinanciero != undefined) {
            $("#txtmnrocuenta").val(militar.Persona.DatoFinanciero.cuenta);
            $("#cmbminstfinanciera").val(militar.Persona.DatoFinanciero.institucion);
            $("#cmbmtipofinanciera").val(militar.Persona.DatoFinanciero.tipo);
            listaCuentas();
        }

        if (militar.Persona.Direccion != undefined) {
            var DIR = militar.Persona.Direccion[0];
            Estados.ObtenerEstados();
            $("#cmbmestado").val(DIR.estado);
            $("#cmbmmunicipio").html('<option selected="selected" value="' + DIR.municipio + '">' + DIR.municipio + '</option>');
            $("#cmbmparroquia").html('<option selected="selected" value="' + DIR.parroquia + '">' + DIR.parroquia + '</option>');
            $("#cmbmciudad").html('<option selected="selected" value="' + DIR.ciudad + '">' + DIR.ciudad + '</option>');
            $("#txtmcalle").val(DIR.calleavenida);
            $("#txtmcasa").val(DIR.casa);
            $("#txtmapto").val(DIR.apartamento);
        }

    } else {
        alert("Cedula no se encuentra registrada como militar dentro del sistema");
        $("#paneldatos").hide();
    }

}

function listaCuentas() {
    $("#datosbancarios").html("");
    militar.Persona.DatoFinanciero.forEach( v => {
        $("#datosbancarios").append(new Option(v.cuenta, v.cuenta + "|" + v.institucion + "|" + v.tipo, true, true));
    });
    $("#datosbancarios").append(new Option("OTRA", "otra", true, true));
    $("#datosbancarios").append(new Option("Selecione", "", true, true));
}

function crearLista() {
    $("#cmbbeneficiario").append(new Option(militar.Persona.DatoBasico.nombreprimero + "(MILITAR)", "T|" + militar.Persona.DatoBasico.cedula, true, true));
    var ncompleto = militar.Persona.DatoBasico.nombreprimero + " " + militar.Persona.DatoBasico.apellidoprimero;
    $("#depositar").append(new Option(ncompleto, militar.Persona.DatoBasico.cedula, true, true));
    if (militar.Familiar.length > 0) {
        $.each(militar.Familiar, function (v) {
            var edad = Util.CalcularEdad(Util.ConvertirFechaHumana(this.Persona.DatoBasico.fechanacimiento));
            var ncompleto2 = this.Persona.DatoBasico.nombreprimero + " " + this.Persona.DatoBasico.apellidoprimero;
            if (edad > 18) {

                $("#depositar").append(new Option(ncompleto2, this.Persona.DatoBasico.cedula, true, true));
            }
            var parentes = Util.ConvertirParentesco(this.parentesco, this.Persona.DatoBasico.sexo);
            $("#cmbbeneficiario").append(new Option(ncompleto2 + "(" + parentes + ")", v + "|" + this.Persona.DatoBasico.cedula, true, true));
        });
    }
    $("#cmbbeneficiario").append(new Option("Seleccione", "|seleccione", true, true));
    $("#depositar").append(new Option("Seleccione", "", true, true));

    $("#cmbbeneficiario").on("change", function () {
        var opt = $("#cmbbeneficiario option:selected").val();
        var picado = $("#cmbbeneficiario option:selected").val().split("|");
        if (opt != '|seleccione') {
            cargarFamiliar(picado[0]);
        } else {
            $("#perfilFamiliar").hide();
        }
    });

    $("#cmbbeneficiario").select2({
        templateResult: formatoCombo
    });
    historico();
}


function cedulaDepositar() {
    var ced = $("#depositar").val();
    $("#cibancario").val(ced);
}

function cargarFamiliar(pos) {
    if (pos == "T") {
        if (militar.Persona.Telefono != undefined) {
            $("#txtmtelefono").val(militar.Persona.Telefono.domiciliario);
            $("#txtmcelular").val(militar.Persona.Telefono.movil);
            $("#txtmcorreo").val(militar.Persona.Correo.principal);
        }

        if (militar.Persona.Direccion != undefined) {
            var DIR = militar.Persona.Direccion[0];
            Estados.ObtenerEstados();
            $("#cmbmestado").val(DIR.estado);
            $("#cmbmmunicipio").html('<option selected="selected" value="' + DIR.municipio + '">' + DIR.municipio + '</option>');
            $("#cmbmparroquia").html('<option selected="selected" value="' + DIR.parroquia + '">' + DIR.parroquia + '</option>');
            $("#cmbmciudad").html('<option selected="selected" value="' + DIR.ciudad + '">' + DIR.ciudad + '</option>');
            $("#txtmcalle").val(DIR.calleavenida);
            $("#txtmcasa").val(DIR.casa);
            $("#txtmapto").val(DIR.apartamento);
        }
        $("#perfilFamiliar").hide();
        return true;
    }
    $("#perfilFamiliar").show();
    var fami = militar.Familiar[pos];
    $("#lblcedulaf").text(fami.Persona.DatoBasico.cedula);
    var ncf = fami.Persona.DatoBasico.nombreprimero + " " + fami.Persona.DatoBasico.apellidoprimero;
    $("#lblnombref").text(ncf);
    var parente = Util.ConvertirParentesco(fami.parentesco, fami.Persona.DatoBasico.sexo)
    $("#lblparentesco").text(parente);
    var fnac = Util.ConvertirFechaHumana(fami.Persona.DatoBasico.fechanacimiento);
    $("#lblfnac").text(fnac);

    if (fami.Persona.Telefono != undefined) {
        $("#txtmtelefono").val(fami.Persona.Telefono.domiciliario);
        $("#txtmcelular").val(fami.Persona.Telefono.movil);
        $("#txtmcorreo").val(fami.Persona.Correo.principal);
    }
    Estados.ObtenerEstados();
    if (fami.Persona.Direccion != undefined) {
        var DIR = fami.Persona.Direccion[0];
        $("#cmbmestado").val(DIR.estado);
        $("#cmbmmunicipio").html('<option selected="selected" value="' + DIR.municipio + '">' + DIR.municipio + '</option>');
        $("#cmbmparroquia").html('<option selected="selected" value="' + DIR.parroquia + '">' + DIR.parroquia + '</option>');
        $("#cmbmciudad").html('<option selected="selected" value="' + DIR.ciudad + '">' + DIR.ciudad + '</option>');
        $("#txtmcalle").val(DIR.calleavenida);
        $("#txtmcasa").val(DIR.casa);
        $("#txtmapto").val(DIR.apartamento);
    }
}

function validadDatosBancarios() {
    var tipoc = $("#tipodecuenta").val();
    var banco = $("#banco").val();
    var cuenta = $("#numerocuenta").val();
    var cedula = $("#cibancario").val();
    var depositar = $("#depositar").val();
    if (tipoc == "S" || banco == "S" || cuenta == "" || cedula == "" || depositar == "") {
      $.notify("Debe ingresar todos los datos financieros", "warn");
      return false;
    }
    return true;
}

function generarPlanilla() {
    if (Util.ValidarFormulario("frmtodoapoyo", "_btnSalvar")) {
        var apoyo = new Apoyo();
        apoyo.montosolicitado = parseFloat($("#montosolicitado").val());

        var cuenta = new CuentaBancaria2();
        cuenta.cuenta = $("#empcuenta").val();
        cuenta.institucion = $("#empbanco").val();
        cuenta.tipo = $("#emptipoc option:selected").val();
        cuenta.cedula = $("#rif").val();
        cuenta.titular = $("#razonsocial").val();
        apoyo.cuentabancaria = cuenta;

        var dir = new Direccion();
        dir.tipo = 0;
        dir.estado = $("#cmbmestado option:selected").val();
        dir.municipio = $("#cmbmmunicipio option:selected").val();
        dir.parroquia = $("#cmbmparroquia option:selected").val();
        dir.ciudad = $("#cmbmciudad").val();
        dir.calleavenida = $("#txtmcalle").val().toUpperCase();
        dir.casa = $("#txtmcasa").val().toUpperCase();
        dir.apartamento = $("#txtmapto").val().toUpperCase();
        var tele = new Telefono();
        tele.domiciliario = $("#txtmtelefono").val();
        tele.movil = $("#txtmcelular").val();
        apoyo.Direccion = dir;
        apoyo.Telefono.domiciliario = tele.domiciliario;
        apoyo.Telefono.movil = tele.movil;

        apoyo.Correo.principal = $("#txtmcorreo").val().toUpperCase();

        var conceptos = new Array();

        var concep = new ConceptoApoyo();
        concep.montoaseguradora = parseFloat($("#montoacubrir").val());
        concep.montoaportar = parseFloat($("#montootroaporte").val());

        var facturaD = new Factura();
        facturaD.fecha = new Date(Util.ConvertirFechaUnix($("#fechafactura").val())).toISOString();
        facturaD.monto = parseFloat($("#montofactura").val());
        facturaD.montootroaporte = parseFloat($("#montootroaporte").val());
        facturaD.numero = $("#numerofactura").val();
        facturaD.control = $("#numerofactura").val();
        var prov = new Beneficiario();
        prov.rif = $("#rif").val();
        prov.razonsocial = $("#razonsocial").val();
        prov.tipoempresa = 'J';
        prov.direccion = $("#empdirec").val();
        facturaD.Beneficiario = prov;
        concep.DatoFactura = facturaD;

        var bene = $("#cmbbeneficiario option:selected").val().split('|');
        var beneficiario = bene[1] + "-" + $("#cmbbeneficiario option:selected").text();
        concep.afiliado = beneficiario;
        concep.descripcion = $("#cmbconcepto option:selected").text();


        conceptos.push(concep);
        apoyo.tipo = parseInt($("#cmbtipoayuda option:selected").val());
        apoyo.Concepto = conceptos;
        var wapoyo = new WApoyo();
        wapoyo.id = militar.Persona.DatoBasico.cedula;
        wapoyo.Apoyo = apoyo;
        wapoyo.nombre = militar.Persona.DatoBasico.nombreprimero + " " + militar.Persona.DatoBasico.apellidoprimero;
        var urlGuardar = Conn.URL + "wapoyo";

        var promesa = CargarAPI({
            sURL: urlGuardar,
            metodo: 'POST',
            valores: wapoyo,
        });

        promesa.then(function (xhRequest) {
            respuesta = JSON.parse(xhRequest.responseText);
            if (respuesta.msj == "") respuesta.msj = "Se proceso con exito....";
            msjRespuesta(respuesta.msj);
            llenarApoyo();

            $("#opciones").hide();
            $("#panelentrada").show();
            $("#panellista").hide();
            $("#panelregistro").hide();
            var ventana = window.open("inc/reciboApoyo.html?id=" + militar.Persona.DatoBasico.cedula, "_blank");
        });
    } else {
        $.notify("Debe ingresar todos los datos para realizar el reembolso");
    }
}

function limpiarApoyo() {
    $('#frmreembolso').each(function () {
        this.reset();
    });
}

function limpiarmdlempresa() {
    $('#frmmdlempresa').each(function () {
        this.reset();
    });
}

function requisitosConcepto() {
    var modal = $("#cmbconcepto option:selected").attr("desplegar");
    if (modal != undefined) {
        inactivarCheck(modal);
        $("#btnGenerar").attr("disabled", true);
        $("#" + modal).modal("show");
    } else {
        $("#btnGenerar").attr("disabled", false);
    }
}

function requisitosMonto() {
    $("#requisitosmonto").modal("show");
    inactivarCheck(modal);
    $("#btnGenerar").attr("disabled", true);
}


function habilitarDireccion(estatus) {
    $("#collapseTree select").attr("disabled", estatus);
    $("#collapseTree :input").attr("disabled", estatus);
    if (estatus == false) {
        $("#btnhabdire").hide();
        $("#btndhabdire").show();
    } else {
        $("#btnhabdire").show();
        $("#btndhabdire").hide();
    }
}

function validaFechaFactura(n) {
    var f = new Date();
    var fecha = (f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear());
    var fecha1 = moment(fecha, "DD-MM-YYYY");
    var ff = $("#fechafactura").val();
    var fecha2 = moment(ff, "DD-MM-YYYY");
    var dif = fecha1.diff(fecha2, 'days');
    if (dif > n) {
        $("#alerta_fecha").text("Fecha fuera de rango");
        $("#alert_fecha").show();
    } else {
        $("#alert_fecha").hide();
    }
}

function limpiarcaja() {
    if (($("#montootroaporte").val()) == 0) {
        $("#montootroaporte").val("")
    }
}

function calcularSolicitado() {
    var mntFactura = $("#montofactura").val();
    var mntAsegura = $("#montoacubrir").val();
    var mntOtroaporte = $("#montootroaporte").val();

    var mntSolici = parseFloat(mntFactura) - parseFloat(mntAsegura) - parseFloat(mntOtroaporte);
    if (isNaN(mntSolici)) {
        $("#montosolicitado").val("");
    } else {
        $("#montosolicitado").val(mntSolici.toFixed(2));
    }
    if (parseFloat(mntSolici) > 7000000) {
        requisitosMonto();
    }
}
