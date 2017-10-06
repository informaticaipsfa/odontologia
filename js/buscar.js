let lstProveedores;

function formatoCombo(state) {
    if (!state.id) {
        return state.text;
    }
    var text = state.text.split("(");
    if (text[1] != undefined) {
        var $state = $(
            '<div class="row"><div class="col-sm-6">' + text[0] + '</div><div class="col-sm-4">(' + text[1] + '</div></div>'
        );
    } else {
        var $state = $(
            '<span>' + state.text + '</span>'
        );
    }

    return $state;
};



function ActivarBuscar() {
    $("#_bxBuscar").show();
    $("#panelentrada").hide();
    $("#panellista").hide();
    $("#panelregistro").hide();
    $("#paneldatos").hide();
}


function ActivarRegMedico() {
    $("#_bxBuscar").show();
    $("#panelentrada").hide();
    $("#panellista").hide();
    $("#panelregistro").hide();
    $("#paneldatos").hide();
}



function Buscar(id) {
    if (id != undefined) {
        $("#_cedula").val(id);
    }
    if ($("#_cedula").val() == "") {
        $("#_contenido").html("Debe introducir una cédula");
        $("#_botonesmsj").html('<button type="button" class="btn btn-default" data-dismiss="modal" id="_aceptar" onClick="IrCedula()">Aceptar</button>');
        $("#modMsj").modal("show");
        return false;
    }
    $("#_cargando").show();
    var url = Conn.URL + "militar/crud/" + $("#_cedula").val();
    var promesa = CargarAPI({
        sURL: url,
        metodo: 'GET',
        valores: '',
        Objeto: militar
    });
    promesa.then(function (xhRequest) {

        militar = JSON.parse(xhRequest.responseText);
        ficha();
    });
    var promesaPro = CargarAPI({
        sURL: 'js/proveedores.js',
        metodo: 'GET',
        valores: '',
    });
    promesaPro.then(function (xhRequest) {
        lstProveedores = JSON.parse(xhRequest.responseText);

    });
}

function ficha() {
    $("#_cargando").hide();
    if (militar.Persona != undefined) {
        var ncompleto = militar.Persona.DatoBasico.nombreprimero + " " + militar.Persona.DatoBasico.apellidoprimero;
        $("#lblnombre").text(ncompleto);
        url = "images/grados/" + militar.Grado.abreviatura + ".png";
        url = url.toLowerCase();
        $("#imgrango").attr("src", url);
        var rutaimg = Conn.URLIMG;
        url = rutaimg + $("#_cedula").val() + ".jpg";
        if (militar.Persona.foto != undefined) {
            rutaimg = Conn.URLTEMP;
            url = rutaimg + $("#_cedula").val() + "/foto.jpg";
        }
        $("#fotoperfil").attr("src", url);

        $("#lblcomponente").text(militar.Componente.descripcion);

        $("#lblgrado").text(militar.Grado.descripcion);

        $("#lblcedula").text(militar.Persona.DatoBasico.cedula);

        $("#lblfnacimiento").val(Util.ConvertirFechaHumana(militar.Persona.DatoBasico.fechanacimiento));

        var estcivil = Util.GenerarEstadoCivil(militar.Persona.DatoBasico.estadocivil, militar.Persona.DatoBasico.sexo);

        $("#lblestcivil").text(estcivil);

        $("#lblsituacion").text(Util.ConvertirSitucacion(militar.situacion));

        $("#paneldatos").show();
        $("#panelperfil").show();
        $("#opciones").show();
        $("#_bxBuscar").hide();
    } else {
        alert("Cedula no se encuentra registrada como militar dentro del sistema");
        $("#paneldatos").hide();
    }
    historico();
    historicoApoyo();
    historicoCarta();
}

function cargaPrograma(tipo) {
    switch (tipo) {
        
        case "p":
            CargarUrl("modalgeneral", "inc/modalsapoyo");
            CargarUrl("panelregistro", "inc/programacionCitas");
            titulos("Programación");
            break;

        case "pa":
            CargarUrl("modalgeneral", "inc/modalsapoyo");
            CargarUrl("panelregistro", "inc/panoramica");
            titulos("Panorámica");
            break;

        case "ec":
            CargarUrl("modalgeneral", "inc/modalsapoyo");
            CargarUrl("panelregistro", "inc/programacionCitas");
            titulos("Exámen Clínico");
            break;

         case "e":
            CargarUrl("modalgeneral", "inc/modalsapoyo");
            CargarUrl("panelregistro", "inc/programacionCitas");
            titulos("Emergencias");
            break;

    }
    $("#opciones").hide();
    $("#panelentrada").show();
}

function titulos(t) {
    $(".lbltituloopt").html(t);
}

function verificarNuevo(val) {
    if (val == false) {
        crearPrograma();
    } else {
        $("#requisitos").modal("show");
    }
}

function verificaCheckModal(mdl, btn) {
    var falta = false;
    $("#" + mdl + " :input[type=checkbox]").each(function () {
        if ($(this)[0].checked == false) {
            falta = true;
        }
    });
    if (falta == true) {
        $("#" + mdl + " button.btnrequisitos").attr("disabled", true);
        $("#" + btn).attr("disabled", true);
    } else {
        $("#" + mdl + " button.btnrequisitos").attr("disabled", false);
        $("#" + btn).attr("disabled", false);
    }
}

function inactivarCheck(mdl) {
    $("#" + mdl + " :input[type=checkbox]").each(function () {
        $(this)[0].checked = false;
        $("#" + mdl + " button.btnrequisitos").attr("disabled", true);
    });
    $("#" + mdl).modal("hide");
}

function crearPrograma() {
    $("#panellista").hide();
    $("#paneldatos").show();
    $("#panelentrada").hide();
    $("#panelregistro").show();
}

function verPrograma() {
    $("#panelregistro").hide();
    $("#paneldatos").show();
    $("#panelentrada").hide();
    $("#panellista").show();
    $("#panelperfil").hide();
}

function imprimirrecibore(pos) {
    if (pos == null) {
        pos = militar.CIS.ServicioMedico.Programa.Reembolso.length;
        pos--;
    }
    var ventana = window.open("inc/reciboReembolso.html?id=" + militar.Persona.DatoBasico.cedula + "&pos=" + pos, "_blank");
}

function imprimirreciboapo(pos) {
    if (pos == null) {
        pos = militar.CIS.ServicioMedico.Programa.Apoyo.length;
        pos--;
    }
    var ventana = window.open("inc/reciboApoyo.html?id=" + militar.Persona.DatoBasico.cedula +"&pos="+ pos, "_blank");
}

function imprimirrecibocarta(pos) {
    if (pos == null) {
        pos = militar.CIS.ServicioMedico.Programa.CartaAval.length;
        pos--;
    }
    var idm = militar.Persona.DatoBasico.cedula;
    var ventana = window.open("cartaAval.html?id="+idm + "&pos=" +pos , "_blank");
}


function historico() {

    $("#historicoReembolso").html(`<thead>
         <tr class="bg-info">
          <td class="pbuscar">#Reembolso</td>
          <td>F. Solicitud</td>
          <td class="pbuscar">Facturas</td>
          <td>Monto Sol.</td>
          <td>Monto Apro.</td>
          <td>Estado</td>
         </tr>
        </thead>
        <tbody id="cuerporeembolsos">
        </tbody>`);

    var t = $('#historicoReembolso').DataTable({
        destroy: true,
        'paging': false,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': false,
        'autoWidth': false,
        "aLengthMenu": [[10, 25, 5, -1], [10, 25, 5, "Todo"]],
        "bStateSave": true,
        "order": [[3, "desc"]],
        "language": {
            "lengthMenu": "Mostar _MENU_ filas por pagina",
            "zeroRecords": "Nada que mostrar",
            "info": "Mostrando _PAGE_ de _PAGES_",
            "infoEmpty": "No se encontro nada",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Buscar",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            },
        },
    });
    t.clear().draw();

    if (militar.CIS.ServicioMedico.Programa.Reembolso != undefined && militar.CIS.ServicioMedico.Programa.Reembolso.length > 0) {
        var html = "";
        var i = 0;
        militar.CIS.ServicioMedico.Programa.Reembolso.forEach( v => {
            var est = conviertEstatus(v.estatus);
            var fcrea = Util.ConvertirFechaHumana(v.fechacreacion, true);
            var listaFact = "";
            var nfac = v.Concepto[0].DatoFactura.numero;
            if (v.Concepto[0].DatoFactura.numero == "") {
                nfac = "Sin factura";
            }
            if (v.Concepto.length > 1) {
                listaFact =  `<div class="dropdown">
                    <button class="btn btn-default dropdown-toggle" type="button"
                      id="dropdownMenu${i}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${nfac}
                      <span class="fa fa-plus"></span>
                    </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenu${i}">`;
                v.Concepto.forEach( w => {
                    var nfac2 = w.DatoFactura.numero;
                    if (nfac2 == "") nfac2 = "Sin Factura"
                    listaFact += `<li class='bg-info'>${nfac2}</li>`;
                });
                listaFact += "</ul></div>";
            } else {
                listaFact = nfac;
            }

            t.row.add([
                `<a href='#cuerpoLstConceptos' onclick="detalleVisible(${i})">${v.numero}</a>
                  <button type='button' class='btn btn-default btn-sm pull-right'
                    onclick="imprimirrecibore(${i})"><i class='fa fa-print'></i></button>`,
                `<b>${fcrea}</b>`,
                listaFact,
                numeral(parseFloat(v.montosolicitado)).format('0,0[.]00 $'),
                numeral(parseFloat(v.montoaprobado)).format('0,0[.]00 $'),
                est
            ]).draw(false);
            i++;
        });
        $('#historicoReembolso thead td.pbuscar').each(function () {
            var title = $(this).text();
            $(this).html(title + '<br><input class="form-group" type="text" placeholder="Buscar" />');
        });
        t.columns().every(function () {
            var that = this;

            $('input', this.header()).on('keyup change', function () {
                if (that.search() !== this.value) {
                    that
                        .search(this.value)
                        .draw();
                }
            });
        });
    }
    console.log("Hola mundo testing...");
}

function detalleVisible(pos) {
    if (pos == null) {
        pos = militar.CIS.ServicioMedico.Programa.Reembolso.length;
        pos--;
    }

    var re = militar.CIS.ServicioMedico.Programa.Reembolso[pos];
    $("#lbldetnumero").text(re.numero);

    var tconcepto = "";
    $.each(militar.CIS.ServicioMedico.Programa.Reembolso[pos].Concepto, function () {
        var ffact = Util.ConvertirFechaHumana(this.DatoFactura.fecha);
        tconcepto += "<tr><td>" + this.afiliado + "</td><td>" + this.descripcion + "</td><td>" + this.DatoFactura.Beneficiario.rif + "|" + this.DatoFactura.Beneficiario.razonsocial + "</td> " +
            "<td>" + this.DatoFactura.numero + "</td><td>" + ffact + "</td><td>" + numeral(parseFloat(this.DatoFactura.monto)).format('0,0[.]00 $') + "</td></tr>";
    })
    tconcepto += "</table>";
    $("#cuerpoLstConceptos").html(tconcepto);
    $("#lstDetalle").show();
    $("#tblTodos").hide();

}

function historicoApoyo() {
    $("#historicoApoyos").html('<thead>\n' +
        '                        <tr class="bg-info"><td class="pbuscar">#Apoyo</td><td>F. Solicitud</td><td class="pbuscar">Factura</td><td style="width: 20%">Monto a Cubrir por el IPSFA.<td>Estado</td></tr>\n' +
        '                        </thead>\n' +
        '                        <tbody id="cuerporeembolsos">\n' +
        '\n' +
        '                        </tbody>');

    var t = $('#historicoApoyos').DataTable({
        destroy: true,
        'paging': false,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': false,
        'autoWidth': false,
        "aLengthMenu": [[10, 25, 5, -1], [10, 25, 5, "Todo"]],
        "bStateSave": true,
        "order": [[3, "desc"]],
        "language": {
            "lengthMenu": "Mostar _MENU_ filas por pagina",
            "zeroRecords": "Nada que mostrar",
            "info": "Mostrando _PAGE_ de _PAGES_",
            "infoEmpty": "No se encontro nada",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Buscar",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            },
        },
    });
    t.clear().draw();


    if (militar.CIS.ServicioMedico.Programa.Apoyo != undefined && militar.CIS.ServicioMedico.Programa.Apoyo.length > 0) {
        var html = "";
        var i = 0;
        $.each(militar.CIS.ServicioMedico.Programa.Apoyo, function (v, ob) {
            var est = conviertEstatus(this.estatus);
            var fcrea = Util.ConvertirFechaHumana(this.fechacreacion, true);
            var listaFact = "";
            var nfac = this.Concepto[0].DatoFactura.numero;
            if (this.Concepto[0].DatoFactura.numero == "") {
                nfac = "Sin factura";
            }
            if (this.Concepto.length > 1) {
                listaFact = "<div class=\"dropdown\">\n" +
                    "            <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu" + i + "\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
                    "            " + nfac +
                    "            <span class=\"fa fa-plus\"></span>\n" +
                    "            </button>\n" +
                    "            <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu" + i + "\">";
                $.each(this.Concepto, function () {
                    var nfac2 = this.DatoFactura.numero;
                    if (nfac2 == "") nfac2 = "Sin Factura"
                    listaFact += "<li class='bg-info'>" + nfac2 + "</li>";
                });
                listaFact += "</ul></div>";
            } else {
                listaFact = nfac;
            }
            t.row.add([
                "<a href='#cuerpoLstConceptos' onclick=\"detalleVisibleApoyo(" + i + ")\">" + this.numero + "</a>" +
                "<button type='button' class='btn btn-default btn-sm pull-right' onclick=\"imprimirreciboapo(" + i + ")\">" + "<i class='fa fa-print'>" + "</i>" + "</button>", //1
                "<b>" + fcrea + "</b>",
                listaFact,
                numeral(parseFloat(this.montosolicitado)).format('0,0[.]00 $'),
                // numeral(parseFloat(this.montoaprobado)).format('0,0[.]00 $'),
                est
            ]).draw(false);
            i++;
        });
        $('#historicoApoyo thead td.pbuscar').each(function () {
            var title = $(this).text();
            $(this).html(title + '<br><input class="form-group" type="text" placeholder="Buscar" />');
        });
        t.columns().every(function () {
            var that = this;

            $('input', this.header()).on('keyup change', function () {
                if (that.search() !== this.value) {
                    that
                        .search(this.value)
                        .draw();
                }
            });
        });
    }
}

function detalleVisibleApoyo(pos) {
    if (pos == null) {
        pos = militar.CIS.ServicioMedico.Programa.Apoyo.length;
        pos--;
    }

    var apo = militar.CIS.ServicioMedico.Programa.Apoyo[pos];
    $("#lbldetnumeroApoyo").text(apo.numero);
    var tconcepto = "";
    $.each(militar.CIS.ServicioMedico.Programa.Apoyo[pos].Concepto, function () {

        var ffact = Util.ConvertirFechaHumana(this.DatoFactura.fecha);
        tconcepto += "<tr><td>" + this.afiliado + "</td><td>" + this.descripcion + "</td><td>" + this.DatoFactura.Beneficiario.rif + "|" + this.DatoFactura.Beneficiario.razonsocial + "</td> " +
            "<td>" + this.DatoFactura.numero + "</td><td>" + ffact + "</td><td>" + numeral(parseFloat(this.DatoFactura.monto)).format('0,0[.]00 $') + "</td>" +
            "<td>" + numeral(parseFloat(this.montoaseguradora)).format('0,0[.]00 $') + "</td><td>" + numeral(parseFloat(this.montoaportar)).format('0,0[.]00 $') + "</td>" +
            "<td>" + numeral(parseFloat(apo.montosolicitado)).format('0,0[.]00 $') + "</td></tr>";
    })
    tconcepto += "</table>";
    $("#cuerpoLstConceptosApoyo").html(tconcepto);
    $("#lstDetalleApoyo").show();
    $("#tblTodos").hide();
    $("#panelperfil").hide();
}

function historicoCarta() {
    $("#historicoCartas").html('<thead>\n' +
        '                        <tr class="bg-info"><td class="pbuscar">#Carta</td><td>F. Solicitud</td><td class="pbuscar">N° Presupuesto</td><td style="width: 20%">Monto a cubrir el IPSFA</td><td>Estado</td></tr>\n' +
        '                        </thead>\n' +
        '                        <tbody id="cuerpocartas">\n' +
        '\n' +
        '                        </tbody>');

    var t = $('#historicoCartas').DataTable({
        destroy: true,
        'paging': false,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': false,
        'autoWidth': false,
        "aLengthMenu": [[10, 25, 5, -1], [10, 25, 5, "Todo"]],
        "bStateSave": true,
        "order": [[3, "desc"]],
        "language": {
            "lengthMenu": "Mostar _MENU_ filas por pagina",
            "zeroRecords": "Nada que mostrar",
            "info": "Mostrando _PAGE_ de _PAGES_",
            "infoEmpty": "No se encontro nada",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Buscar",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            },
        },
    });
    t.clear().draw();


    if (militar.CIS.ServicioMedico.Programa.CartaAval != undefined && militar.CIS.ServicioMedico.Programa.CartaAval.length > 0) {
        var html = "";
        var i = 0;
        $.each(militar.CIS.ServicioMedico.Programa.CartaAval, function (v, ob) {
            var est = conviertEstatus(this.estatus);
            var fcrea = Util.ConvertirFechaHumana(this.fechacreacion, true);
            var listaFact = "";
            var nfac = this.Concepto[0].numeropresupuesto;
            if (this.Concepto[0].numeropresupuesto == "") {
                nfac = "Sin factura";
            }
            if (this.Concepto.length > 1) {
                listaFact = "<div class=\"dropdown\">\n" +
                    "            <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu" + i + "\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
                    "            " + nfac +
                    "            <span class=\"fa fa-plus\"></span>\n" +
                    "            </button>\n" +
                    "            <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu" + i + "\">";
                $.each(this.Concepto, function () {

                    var nfac2 = this.numeropresupuesto;
                    if (nfac2 == "") nfac2 = "Sin Factura"
                    listaFact += "<li class='bg-info'>" + nfac2 + "</li>";
                });
                listaFact += "</ul></div>";
            } else {
                listaFact = nfac;
            }
            t.row.add([
                "<a href='#cuerpoLstConceptos' onclick=\"detalleVisibleCarta(" + i + ")\">" + this.numero + "</a>" +
                "<button type='button' class='btn btn-default btn-sm pull-right' onclick=\"imprimirrecibocarta(" + i + ")\">" + "<i class='fa fa-print'>" + "</i>" + "</button>", //1
                "<b>" + fcrea + "</b>",
                listaFact,
                numeral(parseFloat(this.montosolicitado)).format('0,0[.]00 $'),
                // numeral(parseFloat(this.montoaprobado)).format('0,0[.]00 $'),
                est
            ]).draw(false);
            i++;
        });
        $('#historicoCarta thead td.pbuscar').each(function () {
            var title = $(this).text();
            $(this).html(title + '<br><input class="form-group" type="text" placeholder="Buscar" />');
        });
        t.columns().every(function () {
            var that = this;

            $('input', this.header()).on('keyup change', function () {
                if (that.search() !== this.value) {
                    that
                        .search(this.value)
                        .draw();
                }
            });
        });
    }
}

function detalleVisibleCarta(pos) {
    if (pos == null) {
        pos = militar.CIS.ServicioMedico.Programa.CartaAval.length;
        pos--;
    }

    var car = militar.CIS.ServicioMedico.Programa.CartaAval[pos];
    $("#lbldetnumeroCarta").text(car.numero);
    var tconcepto = "";
    $.each(militar.CIS.ServicioMedico.Programa.CartaAval[pos].Concepto, function () {
        var ffact = Util.ConvertirFechaHumana(this.fechapresupuesto);
        tconcepto += "<tr><td>" + this.afiliado + "</td><td>" + this.motivo + "</td><td>" + this.DatoFactura.Beneficiario.rif + "|" + this.DatoFactura.Beneficiario.razonsocial + "</td> " +
            "<td>" + this.numeropresupuesto + "</td><td>" + ffact + "</td><td>" + this.montopresupuesto + "</td><td>" + this.montoseguro + "</td><td>" + car.montosolicitado + "</td></tr>";

    })
    tconcepto += "</table>";
    $("#cuerpoLstConceptosCarta").html(tconcepto);
    $("#lstDetalleCarta").show();
    $("#tblTodos").hide();
}
