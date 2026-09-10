

$(document).ready(function () {
    cargarCarrito();

    // Evento para enviar el pedido al backend (C#)
    $("#btnEnviarPedido").on("click", function () {
        procesarPedido();
    });
});

// ==========================================
// 1. CARGAR Y RENDERIZAR EL CARRITO
// ==========================================
function cargarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carritoTiendaEddy")) || [];

    if (carrito.length === 0) {
        $("#divContenidoPedido").addClass("d-none");
        $("#divCarritoVacio").removeClass("d-none");
        return;
    }

    $("#divCarritoVacio").addClass("d-none");
    $("#divContenidoPedido").removeClass("d-none");

    let tbody = $("#tbDetallePedido tbody");
    tbody.empty();

    let totalGeneral = 0;

    $.each(carrito, function (i, item) {
        totalGeneral += item.Total;

        let tr = `
            <tr data-idvariante="${item.IdVariante}">
                <td class="ps-3 text-start">
                    <div class="d-flex align-items-center">
                        <img src="${item.Imagen}" class="img-carrito me-3" alt="Img">
                        <div>
                            <h6 class="m-0 fw-bold text-dark">${item.Nombre}</h6>
                            <span class="text-muted fs-13 d-block mt-1">${item.Detalle}</span>
                        </div>
                    </div>
                </td>
                <td class="text-center fw-medium">Bs. ${item.Precio.toFixed(2)}</td>
                <td>
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="input-group input-group-sm w-auto">
                            <button class="btn btn-outline-secondary btn-qty btn-restar" type="button"><i class="ti ti-minus"></i></button>
                            <input type="text" class="form-control input-qty" value="${item.Cantidad}" readonly>
                            <button class="btn btn-outline-secondary btn-qty btn-sumar" type="button"><i class="ti ti-plus"></i></button>
                        </div>
                    </div>
                </td>
                <td class="text-center fw-bold text-success subtotal-item">Bs. ${item.Total.toFixed(2)}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-soft-danger btn-icon btn-sm rounded-circle btn-eliminar-item" title="Quitar del pedido">
                        <i class="ti ti-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.append(tr);
    });

    actualizarTotalesUI(totalGeneral);
}

// ==========================================
// 2. CONTROLES DE CANTIDAD (+ y -)
// ==========================================
$("#tbDetallePedido").on("click", ".btn-sumar", function () {
    let tr = $(this).closest("tr");
    let idVariante = parseInt(tr.data("idvariante"));
    modificarCantidad(idVariante, 1);
});

$("#tbDetallePedido").on("click", ".btn-restar", function () {
    let tr = $(this).closest("tr");
    let idVariante = parseInt(tr.data("idvariante"));
    modificarCantidad(idVariante, -1);
});

function modificarCantidad(idVariante, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carritoTiendaEddy")) || [];
    let index = carrito.findIndex(p => p.IdVariante === idVariante);

    if (index !== -1) {
        let nuevaCantidad = carrito[index].Cantidad + cambio;

        if (nuevaCantidad > 0) {
            carrito[index].Cantidad = nuevaCantidad;
            carrito[index].Total = nuevaCantidad * carrito[index].Precio;
            localStorage.setItem("carritoTiendaEddy", JSON.stringify(carrito));
            cargarCarrito(); // Recargamos para actualizar visualmente
        }
    }
}

// ==========================================
// 3. ELIMINAR ITEM DEL CARRITO
// ==========================================
$("#tbDetallePedido").on("click", ".btn-eliminar-item", function () {
    let tr = $(this).closest("tr");
    let idVariante = parseInt(tr.data("idvariante"));

    // Alerta de confirmación
    Swal.fire({
        title: '¿Quitar producto?',
        text: "Este producto será eliminado de tu pedido.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, quitar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let carrito = JSON.parse(localStorage.getItem("carritoTiendaEddy")) || [];
            carrito = carrito.filter(p => p.IdVariante !== idVariante);

            localStorage.setItem("carritoTiendaEddy", JSON.stringify(carrito));
            cargarCarrito();

            ToastMaster.fire({ icon: 'info', title: 'Producto removido.' });
        }
    });
});

// Función auxiliar para actualizar los textos de los totales
function actualizarTotalesUI(total) {
    $("#lblSubtotal").text(total.toFixed(2));
    $("#lblTotalGeneral").text(total.toFixed(2));
}

// ==========================================
// 4. PROCESAR Y ENVIAR EL PEDIDO A C#
// ==========================================
function procesarPedido() {
    let carrito = JSON.parse(localStorage.getItem("carritoTiendaEddy")) || [];

    if (carrito.length === 0) {
        ToastMaster.fire({ icon: 'error', title: 'Tu carrito está vacío.' });
        return;
    }

    // Aquí prepararemos la lista exacta que pide tu Backend para el envío
    // y haremos la petición AJAX final.
    console.log("Listo para enviar:", carrito);

    /*
    // Estructura AJAX esperada para el siguiente paso:
    $.ajax({
        // ...
    });
    */
}

// fin