/*requirejs.config({

    baseUrl: 'js',
    paths: {
        militar:'militar',
        cis: 'cis'
    },
    shim : {
        militar: {
            exports: 'militar'
        },
        cis: {
            deps: ['militar'],
            exports: 'cis'
        }
    }
});



requirejs(['militar','cis'],
    function   ($,        canvas,   sub) {
        alert("llega");
    });*/



class Conexion{
    constructor(){
        this.IP = "192.168.6.45";
        this.Puerto = ":8080";
        this.PuertoSSL = ":2608";
        this.API = "/devel/api/";
        this.URL = "http://" + this.IP + this.Puerto + this.API;
        this.URLIMG = "http://192.168.12.150/imagenes/";
        this.URLTEMP = "http://192.168.12.150/SSSIFANB/temp/";
        //this.URLSEC = "http://"+this.IP + this.PuertoSSL;
        this.URLSEC = "http://" + this.IP + this.Puerto;
    }
}

function CargarAPI(options){
    //console.log(options.sURL);
    var xhttp = new XMLHttpRequest();
    xhttp.open(options.metodo, options.sURL);
    //n Authorization", "Bearer " + sessionStorage.getItem('ipsfaToken'));
    var promise = new Promise(function(resolve, reject) {
        xhttp.addEventListener('readystatechange', function() {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                if(options.Objeto != undefined){
                    options.Objeto = JSON.parse(xhttp.responseText);
                }
                resolve(xhttp);
            }
        });

        xhttp.addEventListener('error', function() {
            //console.log(xhttp.responseText);
            //respuesta = JSON.parse(xhttp.responseText);
            if (respuesta.tipo != 0){
                $.notify("Se ha Insertado correctamente", "success");
            }else{
                alert(xhttp.responseText);
            }
            reject(xhttp);
        });
    });

    if(options.valores != undefined){
        xhttp.send(JSON.stringify(options.valores));
    }else{
        xhttp.send();
    }

    return promise;
}

function CargarUrl(id, url){
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', url + '.html');
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            $('#'+id).html(xhttp.responseText);
        }
    };
    xhttp.onerror = function() {
        if (this.readyState == 4 && this.status == 0) {
            $.notify("El archivo no ha sido encontrado");
        }

    };
    xhttp.send();
}
