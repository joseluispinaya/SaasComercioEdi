
let tablaData;
let idEditar = 0;

$(document).ready(function () {
    listaCategorias();

    // Botón de actualizar para recargar la tabla manualmente
    $("#btnActualizar").on("click", function () {
        if (tablaData) {
            tablaData.ajax.reload(null, false);
        }
    });
});

function listaCategorias() {
    tablaData = $("#tbCategorias").DataTable({
        responsive: true,
        "ajax": {
            "url": 'CategoriaPage.aspx/ListarCategorias', // Apuntamos al WebMethod que crearemos
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
            { "data": "IdCategoria", "visible": false, "searchable": false },
            { "data": "NombreCategoria" },
            {
                "data": "Estado",
                "render": function (data) {
                    // Pintamos un badge según el estado booleano
                    if (data === true) {
                        return '<span class="badge bg-success">Activo</span>';
                    } else {
                        return '<span class="badge bg-danger">Inactivo</span>';
                    }
                }
            },
            {
                "defaultContent": '<button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-editar"><i class="ti ti-pencil"></i></button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center"
            }
        ],
        "order": [], // Ordenamos por nombre por defecto
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

    // Limpiamos los campos
    $("#txtNombreCategoria").val("");
    $("#chkEstado").prop("checked", true); // Por defecto activo al crear

    $("#modalLabelCategoria").text("Nuevo Registro");
    $("#modalCategoria").modal("show");
});

// ==========================================
// EVENTO: ABRIR MODAL PARA EDITAR
// ==========================================
$('#tbCategorias tbody').on('click', '.btn-editar', function () {
    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();

    idEditar = data.IdCategoria;
    $("#txtNombreCategoria").val(data.NombreCategoria);

    // Mapeamos el estado al switch
    if (data.Estado === true) {
        $("#chkEstado").prop("checked", true);
    } else {
        $("#chkEstado").prop("checked", false);
    }

    $("#modalLabelCategoria").text("Editar Categoría");
    $("#modalCategoria").modal("show");
});

// ==========================================
// EVENTO: GUARDAR O EDITAR CATEGORÍA
// ==========================================
$("#btnGuardarCategoria").on("click", function () {

    // 1. Bloqueo inmediato para evitar doble clic
    $('#btnGuardarCategoria').prop('disabled', true);

    // 2. Validación usando tu lógica dinámica
    const inputs = $("#modalCategoria input.model").serializeArray();
    const inputs_sin_valor = inputs.filter(item => item.value.trim() === "");

    if (inputs_sin_valor.length > 0) {
        const mensaje = `Debe completar el campo: "${inputs_sin_valor[0].name}"`;
        ToastMaster.fire({
            icon: 'warning',
            title: mensaje
        });
        $(`input[name="${inputs_sin_valor[0].name}"]`).focus();
        $('#btnGuardarCategoria').prop('disabled', false);
        return;
    }

    // 3. Armar el objeto para enviar a C#
    const objeto = {
        IdCategoria: idEditar,
        NombreCategoria: $("#txtNombreCategoria").val().trim(),
        Estado: $("#chkEstado").is(":checked")
    };

    // 4. Mostrar overlay de carga en el modal
    $("#modalCategoria").find("div.modal-content").LoadingOverlay("show");

    // 5. Petición AJAX
    $.ajax({
        type: "POST",
        url: "CategoriaPage.aspx/GuardarOrEditCategorias",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalCategoria").find("div.modal-content").LoadingOverlay("hide");

            // Usando tu función de alertas
            mostrarAlertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor // Esperamos 'success', 'warning', o 'error'
            );

            if (response.d.Estado) {
                $("#modalCategoria").modal("hide");

                if (tablaData) {
                    tablaData.ajax.reload(null, false);
                }
                idEditar = 0;
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalCategoria").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            // Desbloqueamos el botón siempre al finalizar
            $('#btnGuardarCategoria').prop('disabled', false);
        }
    });
});

// ==========================================