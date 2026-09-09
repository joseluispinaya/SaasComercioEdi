
let tablaData;

$(document).ready(function () {
    listaProductos();

    $("#btnActualizar").on("click", function () {
        if (tablaData) {
            tablaData.ajax.reload(null, false);
        }
    });
});

// ==========================================
// CARGAR DATATABLE PRINCIPAL
// ==========================================
function listaProductos() {
    tablaData = $("#tbProductos").DataTable({
        responsive: true,
        "ajax": {
            "url": 'ProductoPage.aspx/ListarProductos',
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
            {
                "data": "ImagenUrl",
                "render": function (data) {
                    let url = data && data.trim() !== "" ? data : "Imagenes/sinimagen.png";
                    return `<img src="${url}" class="img-thumbnail-dt" alt="Img">`;
                },
                "orderable": false,
                "searchable": false,
                "className": "text-center"
            },
            { "data": "NombreCategoria" },
            { "data": "NombreProducto", "className": "fw-bold text-dark" },
            {
                "data": "NroVariantes",
                "render": function (data) {
                    return `<span class="badge bg-info rounded-pill px-2 py-1">${data} variacion(es)</span>`;
                },
                "className": "text-center"
            },
            {
                "data": "Estado",
                "render": function (data) {
                    return (data === true)
                        ? '<span class="badge bg-success">Activo</span>'
                        : '<span class="badge bg-danger">Inactivo</span>';
                },
                "className": "text-center"
            },
            {
                "data": null,
                "render": function (data) {
                    // Botón Editar + Botón Detalle
                    return `
                        <button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-editar me-1" title="Editar Producto">
                            <i class="ti ti-pencil"></i>
                        </button>
                        <button class="btn btn-soft-info btn-icon btn-sm rounded-circle btn-detalle" title="Ver Detalles">
                            <i class="ti ti-eye"></i>
                        </button>
                    `;
                },
                "orderable": false,
                "searchable": false,
                "className": "text-center"
            }
        ],
        "order": [[2, "asc"]], // Ordenar por Nombre de Producto por defecto
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

// ==========================================
// EVENTO: BOTÓN EDITAR (Redirección por URL)
// ==========================================
$('#tbProductos tbody').on('click', '.btn-editar', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) { fila = fila.prev(); }
    let data = tablaData.row(fila).data();
    mostrarAlertaZero("¡Atención!", "Producto: " + data.NombreProducto, "info");

    // Suponiendo que tu página de edición se llama EditarProducto.aspx
    //window.location.href = "EditarProducto.aspx?id=" + data.IdProducto;
});

// ==========================================
// EVENTO: BOTÓN VER DETALLE
// ==========================================
$('#tbProductos tbody').on('click', '.btn-detalle', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) { fila = fila.prev(); }
    let data = tablaData.row(fila).data();

    let idProducto = data.IdProducto;

    $.LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "ProductoPage.aspx/ObtenerProductoPorId",
        data: JSON.stringify({ idProducto: idProducto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.LoadingOverlay("hide");

            if (response.d.Estado) {
                let producto = response.d.Data.Producto;
                let variantes = response.d.Data.Variantes;

                // 1. Llenar cabecera del modal
                let urlFoto = producto.ImagenUrl && producto.ImagenUrl.trim() !== "" ? producto.ImagenUrl : "Imagenes/sinimagen.png";
                $("#imgDetalleFoto").attr("src", urlFoto);

                $("#lblDetalleNombre").text(producto.NombreProducto);
                $("#lblDetalleCategoria").text(data.NombreCategoria); // Aprovechamos la data del datatable para la categoría

                if (producto.Estado) {
                    $("#lblDetalleEstado").text("Activo").removeClass("bg-danger").addClass("bg-success");
                } else {
                    $("#lblDetalleEstado").text("Inactivo").removeClass("bg-success").addClass("bg-danger");
                }

                // 2. Llenar tabla de variantes
                let tbody = $("#tbVariantesDetalle tbody");
                tbody.empty();

                if (variantes.length === 0) {
                    tbody.append('<tr><td colspan="4" class="text-muted py-3">No hay variantes registradas.</td></tr>');
                } else {
                    $.each(variantes, function (i, v) {
                        let badgeSabor = v.IdSabor === 0 ? "bg-secondary" : "bg-warning";
                        let badgeEstado = v.Estado ? '<span class="badge bg-success">Activo</span>' : '<span class="badge bg-danger">Inactivo</span>';

                        let tr = `
                            <tr>
                                <td class="fw-medium">${v.NombrePresentacion}</td>
                                <td><span class="badge ${badgeSabor}">${v.NombreSabor}</span></td>
                                <td class="fw-bold text-success">Bs. ${parseFloat(v.Precio).toFixed(2)}</td>
                                <td>${badgeEstado}</td>
                            </tr>
                        `;
                        tbody.append(tr);
                    });
                }

                // Mostrar modal
                $("#modalDetalleProducto").modal("show");

            } else {
                mostrarAlertaZero("¡Error!", response.d.Mensaje, "error");
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $.LoadingOverlay("hide");
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
        }
    });
});

// fin