
const TAMANO_MAXIMO = 2 * 1024 * 1024; // 2 MB
const IMAGEN_DEFECTO = "Imagenes/sinimagen.png";

$(document).ready(function () {
    // Llamadas iniciales para cargar combos
    cargarCategorias();
    cargarPresentaciones();
    cargarSabores();
});

// ==========================================
// 1. MANEJO DE LA IMAGEN (CORREGIDO)
// ==========================================
function mostrarImagenSeleccionada(input) {
    // Si no hay archivos seleccionados (El usuario le dio a Cancelar)
    if (!input.files || input.files.length === 0) {
        resetearVistaFoto(input);
        return;
    }

    let file = input.files[0];

    if (!esImagen(file)) {
        ToastMaster.fire({ icon: 'error', title: 'El archivo seleccionado no es una imagen válida.' });
        resetearVistaFoto(input);
        return;
    }

    if (file.size > TAMANO_MAXIMO) {
        ToastMaster.fire({ icon: 'error', title: 'La imagen supera el tamaño máximo permitido de 2 MB.' });
        resetearVistaFoto(input);
        return;
    }

    let reader = new FileReader();
    reader.onload = (e) => $('#imgFoto').attr('src', e.target.result);
    reader.readAsDataURL(file);
}

function esImagen(file) {
    return file && file.type.startsWith("image/");
}

function resetearVistaFoto(input) {
    $('#imgFoto').attr('src', IMAGEN_DEFECTO);
    input.value = "";
}

$('#txtFoto').change(function () {
    mostrarImagenSeleccionada(this);
});


// ==========================================
// 2. LOGICA DE LA TABLA DE VARIANTES
// ==========================================
$("#btnAgregarVariante").on("click", function () {
    let idPresentacion = $("#cboPresentacion").val();
    let txtPresentacion = $("#cboPresentacion option:selected").text();

    let idSabor = $("#cboSabor").val(); // Si seleccionan "Ninguno", será "0"
    let txtSabor = idSabor === "0" ? "Sin sabor" : $("#cboSabor option:selected").text();

    let precio = $("#txtPrecio").val();

    // Validaciones
    if (idPresentacion === "" || precio === "") {
        ToastMaster.fire({ icon: 'warning', title: 'Debe seleccionar una Presentación y establecer el Precio.' });
        return;
    }

    if (parseFloat(precio) <= 0) {
        ToastMaster.fire({ icon: 'error', title: 'El precio debe ser mayor a 0.' });
        return;
    }

    // Validación de duplicados (Misma presentación y mismo sabor)
    let existeVariante = false;
    $("#tbVariantes tbody tr").not("#trVacioVariantes").each(function () {
        if ($(this).attr("data-idpresentacion") === idPresentacion && $(this).attr("data-idsabor") === idSabor) {
            existeVariante = true;
        }
    });

    if (existeVariante) {
        ToastMaster.fire({ icon: 'warning', title: 'Ya agregaste esta combinación de Presentación y Sabor.' });
        return;
    }

    // Ocultar fila vacía
    $("#trVacioVariantes").hide();

    // Lógica separada para determinar el color del badge
    let badgeClass = idSabor === "0" ? "bg-secondary" : "bg-warning";

    // Armar fila
    let filaHtml = `
        <tr data-idpresentacion="${idPresentacion}" data-idsabor="${idSabor}" data-precio="${precio}">
            <td class="fw-bold">${txtPresentacion}</td>
            <td><span class="badge ${badgeClass}">${txtSabor}</span></td>
            <td class="fw-semibold text-success">Bs. ${parseFloat(precio).toFixed(2)}</td>
            <td>
                <button type="button" class="btn btn-sm btn-soft-danger btn-icon rounded-circle btn-quitar-variante" title="Quitar">
                    <i class="ti ti-trash"></i>
                </button>
            </td>
        </tr>
    `;

    $("#tbVariantes tbody").append(filaHtml);
    $("#btnGuardarProducto").prop("disabled", false);

    // Limpiar precio para el siguiente
    $("#txtPrecio").val("");
});

// Quitar variante de la tabla
$("#tbVariantes tbody").on("click", ".btn-quitar-variante", function () {
    $(this).closest("tr").remove();

    let nroFilas = $("#tbVariantes tbody tr").length;
    if (nroFilas === 1) { // Solo queda la fila vacía oculta
        $("#trVacioVariantes").show();
        $("#btnGuardarProducto").prop("disabled", true);
    }
});


// ==========================================
// 3. EVENTO FINAL: GUARDAR PRODUCTO
// ==========================================
$("#btnGuardarProducto").on("click", function () {

    $('#btnGuardarProducto').prop('disabled', true);
    let idCategoria = $("#cboCategoria").val();

    // Validación de inputs cabecera
    const inputs = $("#contenedorFormulario input.model, #contenedorFormulario select.model").serializeArray();
    const inputs_sin_valor = inputs.filter(item => item.value.trim() === "");

    if (inputs_sin_valor.length > 0) {
        ToastMaster.fire({ icon: 'warning', title: `Debe completar el campo: "${inputs_sin_valor[0].name}"` });
        $(`[name="${inputs_sin_valor[0].name}"]`).focus();
        $('#btnGuardarProducto').prop('disabled', false);
        return;
    }

    // Armar Objeto Producto (Cabecera)
    const objeto = {
        IdCategoria: parseInt(idCategoria),
        NombreProducto: $("#txtNombreProducto").val().trim()
    };

    // Armar Lista de Variantes (Detalle)
    let listaVariantes = [];
    $("#tbVariantes tbody tr").not("#trVacioVariantes").each(function () {
        listaVariantes.push({
            IdPresentacion: parseInt($(this).attr("data-idpresentacion")),
            IdSabor: parseInt($(this).attr("data-idsabor")),
            Precio: parseFloat($(this).attr("data-precio"))
        });
    });


    const fileInput = document.getElementById('txtFoto');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64String = e.target.result.split(',')[1];
            enviarAjaxProducto(objeto, base64String, listaVariantes);
        };
        reader.readAsDataURL(file);
    } else {
        enviarAjaxProducto(objeto, "", listaVariantes);
    }
});

function enviarAjaxProducto(objeto, base64String, listaVariantes) {
    $("#contenedorFormulario").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "ProductoPage.aspx/Guardar",
        data: JSON.stringify({
            objeto: objeto,
            base64Image: base64String,
            listaVariantes: listaVariantes
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#contenedorFormulario").LoadingOverlay("hide");

            if (response.d.Estado) {
                mostrarAlertaTimer('¡Excelente!', response.d.Mensaje, 'success');

                // Redirección exitosa a la lista
                setTimeout(function () {
                    window.location.href = "ListaProductos.aspx";
                }, 2000);
            } else {
                mostrarAlertaTimer('Atención', response.d.Mensaje, response.d.Valor);
                $('#btnGuardarProducto').prop('disabled', false);
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#contenedorFormulario").LoadingOverlay("hide");
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
            $('#btnGuardarProducto').prop('disabled', false);
        }
    });
}

// ==========================================
// FUNCIONES AUXILIARES PARA CARGAR COMBOS
// ==========================================
function cargarCategorias() {
    $("#cboCategoria").html('<option value="">Cargando...</option>');
    $.ajax({
        type: "POST",
        url: "CategoriaPage.aspx/ListarCategorias", // Reutilizando tu endpoint ya creado
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                let opcionesHTML = '<option value="">Seleccione Categoría</option>';
                // Filtramos solo las categorías activas
                const activas = response.d.Data.filter(c => c.Estado === true);
                $.each(activas, function (i, row) {
                    opcionesHTML += `<option value="${row.IdCategoria}">${row.NombreCategoria}</option>`;
                });
                $("#cboCategoria").html(opcionesHTML);
            } else {
                $("#cboCategoria").html('<option value="">Error al cargar</option>');
            }
        }
    });
}

function cargarPresentaciones() {
    $("#cboPresentacion").html('<option value="">Cargando...</option>');
    $.ajax({
        type: "POST",
        url: "ProductoPage.aspx/ListarPresentaciones",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                let opcionesHTML = '<option value="">Seleccione Presentación</option>';
                $.each(response.d.Data, function (i, row) {
                    if (row.Estado) opcionesHTML += `<option value="${row.IdPresentacion}">${row.NombrePresentacion}</option>`;
                });
                $("#cboPresentacion").html(opcionesHTML);
            }
        }
    });
}

function cargarSabores() {
    $("#cboSabor").html('<option value="0">Cargando...</option>');
    $.ajax({
        type: "POST",
        url: "ProductoPage.aspx/ListarSabores",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                let opcionesHTML = '<option value="0">Ninguno / Sin sabor</option>';
                $.each(response.d.Data, function (i, row) {
                    if (row.Estado) opcionesHTML += `<option value="${row.IdSabor}">${row.NombreSabor}</option>`;
                });
                $("#cboSabor").html(opcionesHTML);
            }
        }
    });
}

// fin