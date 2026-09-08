
let map;
let marker;

const ToastMaster = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

function mostrarAlertaTimer(titulo, mensaje, icono, tiempo = 3000) {
    let btnClass = 'btn-primary';

    // Asignamos el color del botón según el ícono para mantener coherencia
    if (icono === 'success') btnClass = 'btn-success';
    else if (icono === 'warning') btnClass = 'btn-warning';
    else if (icono === 'error') btnClass = 'btn-danger';
    else if (icono === 'info') btnClass = 'btn-info';

    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono,
        timer: tiempo,
        timerProgressBar: true,
        showConfirmButton: true, // Muestra el botón por si el usuario quiere cerrar antes
        confirmButtonText: "Entendido",
        buttonsStyling: false,
        showCloseButton: true, // La 'X' en la esquina superior derecha
        customClass: {
            confirmButton: 'btn ' + btnClass
        }
    });
}

async function initMap() {
    // Posición por defecto (Riberalta, Beni)
    const position = { lat: -11.0064, lng: -66.0730 };

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("mapa"), {
        zoom: 15,
        center: position,
        mapId: "DEMOMAPA",
    });

    // Agregar marcador en la posición inicial
    marker = new AdvancedMarkerElement({
        position: position,
        map: map,
        gmpDraggable: true // Habilitar arrastrar
    });

    // Mostrar las coordenadas iniciales en los inputs
    updateInputs(position.lat, position.lng);

    // Evento para actualizar inputs al mover el marcador
    marker.addListener("dragend", function (event) {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        updateInputs(newLat, newLng);
    });

    // Evento para agregar marcador en un clic en el mapa
    map.addListener("click", function (event) {
        const clickedLat = event.latLng.lat();
        const clickedLng = event.latLng.lng();

        marker.position = { lat: clickedLat, lng: clickedLng };
        updateInputs(clickedLat, clickedLng);
    });
}

// Función auxiliar para actualizar los inputs
function updateInputs(lat, lng) {
    document.getElementById("txtLatitud").value = lat.toFixed(7);
    document.getElementById("txtLongitud").value = lng.toFixed(7);
}

// FUNCIÓN DE GEOLOCALIZACIÓN GPS
function obtenerUbicacionUsuarioNew() {
    if (!navigator.geolocation) {
        ToastMaster.fire({ icon: 'error', title: 'Tu navegador no soporta geolocalización.' });
        return;
    }

    let btnOriginal = $('#btnUbicacion').html();
    $('#btnUbicacion').prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Buscando...');

    const opciones = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // 1. Actualizamos inputs
            updateInputs(lat, lng);

            // 2. MAGIA: Movemos el mapa y el marcador a la nueva ubicación
            const nuevaUbicacion = { lat: lat, lng: lng };
            map.setCenter(nuevaUbicacion);
            map.setZoom(17); // Hacemos un zoom más cercano ya que es GPS exacto
            marker.position = nuevaUbicacion;

            ToastMaster.fire({ icon: 'success', title: '¡Ubicación obtenida correctamente!' });

            // Restauramos el botón
            $('#btnUbicacion').prop('disabled', false).html(btnOriginal);
        },
        function (error) {
            let mensajeError = "";
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    mensajeError = "Debes permitir el acceso a la ubicación en tu navegador.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    mensajeError = "La información de ubicación no está disponible.";
                    break;
                case error.TIMEOUT:
                    mensajeError = "Se agotó el tiempo de espera para obtener la ubicación.";
                    break;
                default:
                    mensajeError = "Ocurrió un error desconocido al obtener el GPS.";
                    break;
            }

            ToastMaster.fire({ icon: 'error', title: mensajeError });
            $('#btnUbicacion').prop('disabled', false).html(btnOriginal);
        },
        opciones
    );
}

$(document).ready(function () {
    // Mostrar/Ocultar contraseña
    $("#btnTogglePassword").on("click", function () {
        const inputClave = $("#txtClave");
        const type = inputClave.attr("type") === "password" ? "text" : "password";
        inputClave.attr("type", type);
        $(this).find("i").toggleClass("ti-eye ti-eye-off");
    });

    // Evento del botón GPS
    $("#btnUbicacion").on("click", function () {
        obtenerUbicacionUsuarioNew();
    });

    // Evento Guardar Registro
    $("#btnGuardarRegistro").on("click", function () {

        // 1. Bloqueamos el botón para evitar envíos múltiples
        $('#btnGuardarRegistro').prop('disabled', true);

        // 2. Validación dinámica de campos vacíos
        const inputs = $(".model").serializeArray();
        const inputs_sin_valor = inputs.filter(item => item.value.trim() === "");

        if (inputs_sin_valor.length > 0) {
            const campo = inputs_sin_valor[0].name;
            ToastMaster.fire({ icon: 'warning', title: `Debe completar el campo: "${campo}"` });
            $(`[name="${campo}"]`).focus();

            // Desbloqueamos el botón porque falló la validación
            $('#btnGuardarRegistro').prop('disabled', false);
            return;
        }

        // 3. Construcción del objeto ECliente
        const objeto = {
            NombreCompleto: $("#txtNombreCompleto").val().trim(),
            NroCI: $("#txtNroCI").val().trim(),
            NroContacto: $("#txtNroContacto").val().trim(),
            Correo: $("#txtCorreo").val().trim(),
            ClaveHash: $("#txtClave").val().trim(),
            UbicacionNegocio: $("#txtUbicacionNegocio").val().trim(),
            // Convertimos explícitamente a decimal (float) para evitar errores de parseo en C#
            Latitud: parseFloat($("#txtLatitud").val()),
            Longitud: parseFloat($("#txtLongitud").val())
        };

        // 4. Mostramos el overlay de carga estilizado
        $.LoadingOverlay("show", {
            image: "",
            custom: '<div class="spinner-border text-warning m-2" style="height: 5rem; width: 5rem;" role="status"></div>',
            text: "Procesando el registro...",
            textColor: "#ffffff",
            background: "rgba(0, 0, 0, 0.85)"
        });

        // 5. Petición AJAX al servidor
        $.ajax({
            type: "POST",
            url: "RegistroPage.aspx/GuardarClientes",
            data: JSON.stringify({ objeto: objeto }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.LoadingOverlay("hide");

                if (response.d.Estado) {
                    // Éxito: Mostramos alerta y redirigimos después de 3 segundos
                    mostrarAlertaTimer("¡Excelente!", "Registro guardado exitosamente. Ya puedes iniciar sesión.", "success");

                    setTimeout(function () {
                        window.location.href = "Default.aspx";
                    }, 3200);
                } else {
                    // Falla controlada desde C# (ej. correo duplicado)
                    mostrarAlertaTimer("¡Atención!", response.d.Mensaje, response.d.Valor);
                }
            },
            error: function (xhr) {
                console.log(xhr.responseText);
                $.LoadingOverlay("hide");
                mostrarAlertaTimer("¡Atención!", "Error de comunicación con el servidor.", "error");
            },
            complete: function () {
                // 6. Desbloqueamos el botón pase lo que pase
                $('#btnGuardarRegistro').prop('disabled', false);
            }
        });
    });
});

// Lógica AJAX aquí...