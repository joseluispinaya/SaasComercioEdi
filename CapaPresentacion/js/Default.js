
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

$(document).ready(function () {

    // ==========================================
    // EFECTO NAVBAR AL HACER SCROLL
    // ==========================================
    $(window).scroll(function () {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('shadow');
        } else {
            $('.navbar').removeClass('shadow');
        }
    });

    // ==========================================
    // ABRIR MODAL DE LOGIN
    // ==========================================
    $("#btnAbrirLogin").click(function (e) {
        e.preventDefault();

        // 1. Limpiamos los campos de texto
        $("#txtCorreoLogin").val("");
        $("#txtClaveLogin").val("");

        // 2. Abrimos el modal usando la API de Bootstrap 5
        // const modalLogin = new bootstrap.Modal(document.getElementById('modalLogin'));
        // modalLogin.show();

        $("#modalLogin").modal("show");
    });

    // ==========================================
    // REDIRECCIÓN A REGISTRO
    // ==========================================
    $("#btnAbrirRegistro").click(function (e) {
        e.preventDefault();
        window.location.href = "RegistroPage.aspx";
    });

    // ==========================================
    // MOSTRAR/OCULTAR CONTRASEÑA
    // ==========================================
    $("#btnToggleClaveLogin").on("click", function () {
        const inputClave = $("#txtClaveLogin");
        const icon = $(this).find("i");

        if (inputClave.attr("type") === "password") {
            inputClave.attr("type", "text");
            icon.removeClass("fa-eye").addClass("fa-eye-slash");
        } else {
            inputClave.attr("type", "password");
            icon.removeClass("fa-eye-slash").addClass("fa-eye");
        }
    });

    // ==========================================
    // EVENTO: BOTÓN INGRESAR (Login)
    // ==========================================
    $("#btnIngresar").on("click", function () {
        const correo = $("#txtCorreoLogin").val().trim();
        const clave = $("#txtClaveLogin").val().trim();

        // Validación inicial
        if (correo === "" || clave === "") {
            ToastMaster.fire({
                icon: 'warning',
                title: 'Por favor, ingrese su correo y contraseña.'
            });
            return;
        }

        // Bloqueamos el botón y mostramos estado de carga
        const btnOriginal = $('#btnIngresar').html();
        $('#btnIngresar').prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Verificando...');

        // Llamada AJAX al WebMethod
        $.ajax({
            type: "POST",
            url: "Default.aspx/InicioSesion",
            data: JSON.stringify({ Correo: correo, Clave: clave }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.d.Estado) {

                    const usuarioData = response.d.Data;

                    sessionStorage.setItem('usuarioLog', JSON.stringify(usuarioData));
                    // Login exitoso
                    mostrarAlertaTimer("¡Bienvenido!", response.d.Mensaje, "success", 2000);

                    // Redirección dinámica usando el Valor enviado desde C#
                    setTimeout(function () {
                        window.location.href = response.d.Valor;
                    }, 2200); // 1.5 segundos para que lea la alerta
                } else {
                    // Error de credenciales o cuenta inactiva
                    mostrarAlertaTimer("¡Atención!", response.d.Mensaje, "warning");
                    $('#btnIngresar').prop('disabled', false).html(btnOriginal);
                }
            },
            error: function (xhr) {
                console.log(xhr.responseText);
                mostrarAlertaTimer("¡Error!", "Error de comunicación con el servidor.", "error");
                $('#btnIngresar').prop('disabled', false).html(btnOriginal);
            }
        });
    });

});