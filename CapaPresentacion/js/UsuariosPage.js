
let tablaData;
let idEditar = 0;

$(document).ready(function () {
    cargarRoles();
    listaUsuarios();

    $("#btnActualizar").on("click", function () {
        if (tablaData) {
            tablaData.ajax.reload(null, false);
        }
    });
});

// ==========================================
// CARGAR COMBO DE ROLES
// ==========================================
function cargarRoles() {

    $("#cboRol").html('<option value="">Cargando...</option>');

    $.ajax({
        type: "POST",
        url: "UsuariosPage.aspx/ListaRoles",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">Seleccione Rol</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdRol}">${row.NombreRol}</option>`;
                });

                $("#cboRol").html(opcionesHTML);

            } else {
                $("#cboRol").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboRol").html('<option value="">Error de conexión</option>');
        }
    });
}

// ==========================================
// CARGAR DATATABLE
// ==========================================
function listaUsuarios() {
    tablaData = $("#tbUsuarios").DataTable({
        responsive: true,
        "ajax": {
            "url": 'UsuariosPage.aspx/ListaUsuarios',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return "{}";
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    return json.d.Data;
                } else {
                    mostrarAlertaZero("¡Atención!", json.d.Mensaje, "error");
                    return [];
                }
            }
        },
        "columns": [
            { "data": "IdUsuarioWeb", "visible": false, "searchable": false },
            {
                "data": null,
                "render": function (data) {
                    return `<span class="fw-bold text-body">${data.Nombres} ${data.Apellidos}</span>`;
                }
            },
            {
                "data": "NroCI",
                "render": function (data) {
                    return `<span class="badge border border-secondary text-secondary fs-13 px-2 py-1">
                                <i class="ti ti-id me-1"></i>${data}
                            </span>`;
                }
            },
            { "data": "NombreRol" },
            {
                "data": "Correo",
                "render": function (data) {
                    // Lo hacemos clickeable para abrir el gestor de correos
                    return `<a href="mailto:${data}" class="text-body text-decoration-none"><i class="ti ti-mail-forward text-muted me-1"></i>${data}</a>`;
                }
            },
            { "data": "NroContacto" },
            {
                "data": "Estado",
                "className": "text-center",
                "render": function (data) {
                    // Badges modernos (subtle) de Bootstrap 5
                    if (data === true)
                        return '<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"><i class="ti ti-check me-1"></i>Activo</span>';
                    else
                        return '<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1"><i class="ti ti-x me-1"></i>Inactivo</span>';
                }
            },
            {
                "data": null,
                "render": function (data) {
                    // Botón Editar + Botón Reset Password
                    return `
                        <button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-editar" title="Editar">
                            <i class="ti ti-pencil"></i>
                        </button>
                        <button class="btn btn-soft-warning btn-icon btn-sm rounded-circle btn-reset" title="Restablecer Clave">
                            <i class="ti ti-key"></i>
                        </button>
                    `;
                },
                "orderable": false,
                "searchable": false,
                "className": "text-center"
            }
        ],
        "order": [[0, "desc"]],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

// ==========================================
// EVENTO: ABRIR MODAL PARA NUEVO REGISTRO
// ==========================================
$("#btnNuevoRegistro").on("click", function () {
    idEditar = 0;

    $("#txtNombres").val("");
    $("#txtApellidos").val("");
    $("#txtNroCI").val("");
    $("#txtCorreo").val("");
    $("#txtNroContacto").val("");
    $("#cboRol").val("");
    $("#chkEstado").prop("checked", true);

    // Mostramos la etiqueta informativa de que la clave será el CI
    $("#lblInfoClave").show();

    $("#modalLabelUsuario").text("Nuevo Registro de Usuario");
    $("#modalUsuario").modal("show");
});

// ==========================================
// EVENTO: ABRIR MODAL PARA EDITAR
// ==========================================
$('#tbUsuarios tbody').on('click', '.btn-editar', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) { fila = fila.prev(); }
    let data = tablaData.row(fila).data();

    idEditar = data.IdUsuarioWeb;

    $("#txtNombres").val(data.Nombres);
    $("#txtApellidos").val(data.Apellidos);
    $("#txtNroCI").val(data.NroCI);
    $("#txtCorreo").val(data.Correo);
    $("#txtNroContacto").val(data.NroContacto);
    $("#cboRol").val(data.IdRol);

    $("#chkEstado").prop("checked", (data.Estado === true));

    // Ocultamos la etiqueta de clave por defecto porque es edición
    $("#lblInfoClave").hide();

    $("#modalLabelUsuario").text("Editar Usuario");
    $("#modalUsuario").modal("show");
});

// ==========================================
// EVENTO: RESETEAR CLAVE
// ==========================================
$('#tbUsuarios tbody').on('click', '.btn-reset', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) { fila = fila.prev(); }
    let data = tablaData.row(fila).data();

    // Confirmación con SweetAlert2
    Swal.fire({
        title: '¿Restablecer Contraseña?',
        text: `La contraseña para ${data.Nombres} volverá a ser su Nro. de CI (${data.NroCI}).`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ffc107',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, restablecer',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Aquí llamarías a tu WebMethod para el Reset
            console.log("Restableciendo clave para ID: " + data.IdUsuarioWeb);
            // mostrarAlertaTimer("¡Hecho!", "La contraseña ha sido restablecida.", "success");
        }
    });
});

// ==========================================
// EVENTO: GUARDAR USUARIO
// ==========================================
$("#btnGuardarUsuario").on("click", function () {

    $('#btnGuardarUsuario').prop('disabled', true);

    const inputs = $("#modalUsuario .model").serializeArray();
    const inputs_sin_valor = inputs.filter(item => item.value.trim() === "");

    if (inputs_sin_valor.length > 0) {
        const campo = inputs_sin_valor[0].name;
        ToastMaster.fire({ icon: 'warning', title: `Debe completar el campo: "${campo}"` });
        $(`[name="${campo}"]`).focus();
        $('#btnGuardarUsuario').prop('disabled', false);
        return;
    }

    const objeto = {
        IdUsuarioWeb: idEditar,
        IdRol: parseInt($("#cboRol").val()),
        Nombres: $("#txtNombres").val().trim(),
        Apellidos: $("#txtApellidos").val().trim(),
        NroCI: $("#txtNroCI").val().trim(),
        Correo: $("#txtCorreo").val().trim(),
        NroContacto: $("#txtNroContacto").val().trim(),
        Estado: $("#chkEstado").is(":checked")
    };

    $("#modalUsuario").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "UsuariosPage.aspx/GuardarOrEditUsuarios",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalUsuario").find("div.modal-content").LoadingOverlay("hide");

            mostrarAlertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#modalUsuario").modal("hide");
                if (tablaData) {
                    tablaData.ajax.reload(null, false);
                }
                idEditar = 0;
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalUsuario").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            $('#btnGuardarUsuario').prop('disabled', false);
        }
    });
});

// fin