
let latitudActual = 0;
let longitudActual = 0;

$(document).ready(function () {
    // Inicializar Flatpickr
    flatpickr("#txtFecha", {
        dateFormat: "d/m/Y",
        defaultDate: "today",
        allowInput: false, // Mejor false para forzar a usar el calendario
        locale: "es"
    });

    cargarRepartidores();

    $("#btnBuscar").on("click", function () {
        buscarEntregas();
    });
});

function cargarRepartidores() {
    $.ajax({
        type: "POST",
        url: "ControlEntregas.aspx/ListaRepartidores", // WebMethod que usa tu nueva lógica LINQ
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                const lista = response.d.Data;

                if (lista != null && lista.length > 0) {
                    let opcionesHTML = '<option value="">Seleccione un Repartidor</option>';

                    $.each(lista, function (i, row) {
                        opcionesHTML += `<option value="${row.IdUsuarioWeb}">${row.Nombres} ${row.Apellidos}</option>`;
                    });

                    $("#cboRepartidor").html(opcionesHTML);
                } else {
                    $("#cboRepartidor").html('<option value="">No hay repartidores disponibles</option>');
                }


            } else {
                $("#cboRepartidor").html('<option value="">Error al cargar</option>');
            }
        }
    });
}

function buscarEntregas() {
    let idRepartidor = $("#cboRepartidor").val();
    let fecha = $("#txtFecha").val(); // Viene en formato dd/MM/yyyy

    if (idRepartidor === "") {
        mostrarAlertaZero("Atención", "Debe seleccionar un repartidor.", "warning");
        return;
    }

    $("#contenedorPedidos").html('<div class="col-12 text-center py-4"><div class="spinner-border text-success" role="status"></div></div>');

    $.ajax({
        type: "POST",
        url: "ControlEntregas.aspx/BuscarEntregas",
        data: JSON.stringify({ idRepartidor: parseInt(idRepartidor), fecha: fecha }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#contenedorPedidos").empty();

            if (response.d.Estado) {
                let pedidos = response.d.Data;

                if (pedidos.length === 0) {
                    $("#contenedorPedidos").html('<div class="col-12 text-center text-muted py-5"><i class="ti ti-mood-empty fs-24 mb-2 d-block"></i>Este repartidor no tiene entregas en la fecha seleccionada.</div>');
                    return;
                }

                // Variable para sumar el total del día
                let totalDia = 0;

                $.each(pedidos, function (i, item) {
                    totalDia += item.TotalPedido;

                    let card = `
                        <div class="col-xl-3 col-lg-4 col-md-6">
                            <div class="card card-pedido" onclick="abrirModalDetalle(${item.IdPedido}, '${item.NombreCliente}', '${item.FechaHoraLocal}', ${item.TotalPedido}, ${item.Latitud}, ${item.Longitud})">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="text-muted fw-semibold fs-12"># PED-${item.IdPedido.toString().padStart(5, '0')}</span>
                                        <span class="badge bg-success"><i class="ti ti-check me-1"></i>Entregado</span>
                                    </div>
                                    <h5 class="fw-bold text-dark text-truncate mb-1" title="${item.NombreCliente}">${item.NombreCliente}</h5>
                                    <p class="text-muted fs-13 mb-2"><i class="ti ti-clock me-1"></i>${item.FechaHoraLocal}</p>
                                    <h4 class="text-success fw-bold m-0">Bs. ${item.TotalPedido.toFixed(2)}</h4>
                                </div>
                            </div>
                        </div>
                    `;
                    $("#contenedorPedidos").append(card);
                });

                // Opcional: Agregar una tarjeta extra o un header con el Total Recaudado del día
                let headerTotal = `<div class="col-12 mb-2"><h5 class="text-dark fw-bold border-bottom pb-2">Total Recaudado: <span class="text-success">Bs. ${totalDia.toFixed(2)}</span></h5></div>`;
                $("#contenedorPedidos").prepend(headerTotal);

            } else {
                mostrarAlertaZero("Error", response.d.Mensaje, "error");
            }
        }
    });
}

function abrirModalDetalle(idPedido, cliente, fecha, total, latitud, longitud) {
    latitudActual = latitud;
    longitudActual = longitud;

    $("#lblModalTitulo").text(`Pedido #PED-${idPedido.toString().padStart(5, '0')} - ${cliente}`);
    $("#lblModalFecha").text(fecha);
    $("#lblModalTotal").text(total.toFixed(2));

    let tbody = $("#tbDetallePedido tbody");
    tbody.html('<tr><td colspan="4" class="text-center py-3"><div class="spinner-border spinner-border-sm"></div></td></tr>');

    $("#modalDetalleEntrega").modal("show");

    // Reutilizas el WebMethod que ya creaste para ListaPedidos.aspx
    $.ajax({
        type: "POST",
        url: "ListaPedidos.aspx/ObtenerDetalle",
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

$("#btnVerUbicacion").on("click", function () {
    if (latitudActual !== 0 && longitudActual !== 0) {
        let urlMaps = `https://www.google.com/maps?q=${latitudActual},${longitudActual}`;
        window.open(urlMaps, '_blank');
    } else {
        mostrarAlertaZero("Atención", "El cliente no tiene una ubicación registrada.", "warning");
    }
});

// fin