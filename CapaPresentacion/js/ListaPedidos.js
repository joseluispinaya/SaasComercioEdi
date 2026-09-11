
let idPedidoSeleccionado = 0;

$(document).ready(function () {
    // Cargar con el valor por defecto del select (1 = Pendientes)
    cargarPedidos();

    $("#cboFiltroEstado").on("change", function () {
        cargarPedidos();
    });
});

// ==========================================
// 1. CARGAR TARJETAS DE PEDIDOS
// ==========================================
function cargarPedidos() {
    let estado = $("#cboFiltroEstado").val();
    $("#contenedorPedidos").html('<div class="col-12 text-center py-4"><div class="spinner-border text-primary" role="status"></div></div>');

    $.ajax({
        type: "POST",
        url: "ListaPedidos.aspx/ListarPedidosAdmin", // WebMethod que debes crear
        data: JSON.stringify({ estadoPedido: parseInt(estado) }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#contenedorPedidos").empty();

            if (response.d.Estado) {
                let pedidos = response.d.Data;

                if (pedidos.length === 0) {
                    $("#contenedorPedidos").html('<div class="col-12 text-center text-muted py-5"><i class="ti ti-inbox fs-24 mb-2 d-block"></i>No se encontraron pedidos en este estado.</div>');
                    return;
                }

                $.each(pedidos, function (i, item) {

                    // Configuración visual según estado
                    let claseBorde = "";
                    let badgeEstado = "";

                    switch (item.EstadoPedido) {
                        case 1: claseBorde = "border-pendiente"; badgeEstado = '<span class="badge bg-warning text-dark">Pendiente</span>'; break;
                        case 2: claseBorde = "border-entregado"; badgeEstado = '<span class="badge bg-success">Entregado</span>'; break;
                        case 3: claseBorde = "border-camino"; badgeEstado = '<span class="badge bg-info">En Camino</span>'; break;
                        case 4: claseBorde = "border-cancelado"; badgeEstado = '<span class="badge bg-danger">Cancelado</span>'; break;
                    }

                    let card = `
                        <div class="col-xl-3 col-lg-4 col-md-6">
                            <div class="card card-pedido ${claseBorde}" onclick="abrirModalPedido(${item.IdPedido}, '${item.NombreCliente}', '${item.FechaHoraLocal}', ${item.TotalPedido}, ${item.EstadoPedido}, ${item.Latitud}, ${item.Longitud})">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="text-muted fw-semibold fs-12"># PED-${item.IdPedido.toString().padStart(5, '0')}</span>
                                        ${badgeEstado}
                                    </div>
                                    <h5 class="fw-bold text-dark text-truncate mb-1" title="${item.NombreCliente}">${item.NombreCliente}</h5>
                                    <p class="text-muted fs-13 mb-3"><i class="ti ti-clock me-1"></i>${item.FechaHoraLocal}</p>
                                    <h4 class="text-primary fw-bold m-0">Bs. ${item.TotalPedido.toFixed(2)}</h4>
                                </div>
                            </div>
                        </div>
                    `;
                    $("#contenedorPedidos").append(card);
                });
            } else {
                mostrarAlertaZero("Error", response.d.Mensaje, "error");
            }
        }
    });
}

// Agregamos variables globales para retener las coordenadas del pedido abierto
let latitudActual = 0;
let longitudActual = 0;
function abrirModalPedido(idPedido, cliente, fecha, total, estadoPedido, latitud, longitud) {
    idPedidoSeleccionado = idPedido;

    // Guardamos las coordenadas globalmente para el botón
    latitudActual = latitud;
    longitudActual = longitud;

    // Llenar cabecera
    $("#lblModalTitulo").text(`Pedido #PED-${idPedido.toString().padStart(5, '0')} - ${cliente}`);
    $("#lblModalFecha").text(fecha);
    $("#lblModalTotal").text(total.toFixed(2));

    // Lógica visual del cambio de estado
    if (estadoPedido === 2 || estadoPedido === 4) {
        $("#divGestionEstado").addClass("d-none");
        $("#divEstadoFinalizado").removeClass("d-none");

        let msj = estadoPedido === 2 ? "Este pedido ya fue entregado." : "Este pedido fue cancelado.";
        $("#lblMensajeFinalizado").text(msj);
    } else {
        $("#divEstadoFinalizado").addClass("d-none");
        $("#divGestionEstado").removeClass("d-none");

        // Lógica predictiva para el combo de estados
        if (estadoPedido === 1) {
            // Si está Pendiente, el siguiente paso obvio es En Camino (3)
            $("#cboCambiarEstado").val("3");
        } else if (estadoPedido === 3) {
            // Si ya está En Camino, el siguiente paso obvio es Entregado (2)
            $("#cboCambiarEstado").val("2");
        }
    }

    // Cargar productos
    let tbody = $("#tbDetallePedido tbody");
    tbody.html('<tr><td colspan="4" class="text-center py-3"><div class="spinner-border spinner-border-sm"></div></td></tr>');

    $("#modalGestionPedido").modal("show");

    $.ajax({
        type: "POST",
        url: "ListaPedidos.aspx/ObtenerDetalle", // WebMethod que debes crear
        data: JSON.stringify({ idPedido: idPedido }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            tbody.empty();
            if (response.d.Estado) {
                $.each(response.d.Data, function (i, v) {
                    let detalleSabor = v.NombreSabor !== "Sin Sabor" ? `<span class="badge bg-secondary ms-1">${v.NombreSabor}</span>` : '';

                    let tr = `
                        <tr>
                            <td class="text-start ps-3">
                                <h6 class="m-0 fw-bold text-dark">${v.NombreProducto}</h6>
                                <span class="text-muted fs-13">${v.NombrePresentacion} ${detalleSabor}</span>
                            </td>
                            <td>${v.PrecioUnitario.toFixed(2)}</td>
                            <td class="fw-bold">${v.Cantidad}</td>
                            <td class="text-end pe-3 fw-bold text-success">${v.SubTotal.toFixed(2)}</td>
                        </tr>
                    `;
                    tbody.append(tr);
                });
            }
        }
    });
}

// 3. NUEVO EVENTO PARA EL BOTÓN DEL MAPA
$("#btnVerUbicacion").on("click", function () {
    // Verificamos que las coordenadas existan y no sean cero
    if (latitudActual !== 0 && longitudActual !== 0) {
        // Abre Google Maps en una nueva pestaña con el pin exacto
        let urlMaps = `https://www.google.com/maps?q=${latitudActual},${longitudActual}`;
        window.open(urlMaps, '_blank');
    } else {
        mostrarAlertaZero("Atención", "El cliente no tiene una ubicación registrada.", "warning");
    }
});

// ACTUALIZACIÓN DEL EVENTO GUARDAR
$("#btnGuardarEstado").on("click", function () {
    let nuevoEstado = parseInt($("#cboCambiarEstado").val());

    let btnOriginal = $(this).html();
    $(this).prop("disabled", true).html('<span class="spinner-border spinner-border-sm"></span>');

    $.ajax({
        type: "POST",
        url: "ListaPedidos.aspx/ActualizarEstado",
        // Ya no enviamos el idRepartidor desde aquí
        data: JSON.stringify({
            idPedido: idPedidoSeleccionado,
            estadoPedido: nuevoEstado
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#btnGuardarEstado").prop("disabled", false).html(btnOriginal);

            if (response.d.Estado) {
                $("#modalGestionPedido").modal("hide");

                // Si entregó el pedido, mostramos un mensaje genial
                let msj = nuevoEstado === 2 ? "¡Entrega registrada exitosamente!" : response.d.Mensaje;
                mostrarAlertaTimer("¡Hecho!", msj, "success");

                cargarPedidos(); // Recargar el tablero de tarjetas
            } else {
                mostrarAlertaZero("Atención", response.d.Mensaje, response.d.Valor);
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#btnGuardarEstado").prop("disabled", false).html(btnOriginal);
            mostrarAlertaZero("Error", "Error de comunicación con el servidor.", "error");
        }
    });
});

// ==========================================