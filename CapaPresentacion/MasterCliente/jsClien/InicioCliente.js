
// Variable global para acceder al catálogo rápidamente sin hacer peticiones extra
let catalogoGlobal = [];

$(document).ready(function () {
    cargarCatalogo();
    actualizarContadorCarrito();
    botonesCategorias();

    // Redirección al carrito
    $("#btnIrAlCarrito").on("click", function () {
        window.location.href = "PedidoPage.aspx";
    });
});

function botonesCategorias() {
    $.ajax({
        type: "POST",
        url: "/CategoriaPage.aspx/ListarCategorias",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {

            $("#contenedorCategorias").empty();
            if (response.d.Estado) {
                let catego = response.d.Data;

                let verTodo = '<button type="button" class="btn btn-info rounded-pill" onclick="obtenerIdCategoria(0)">Ver Todo</button>';
                $.each(catego, function (i, row) {
                    let btn = `<button type="button" class="btn btn-info rounded-pill" onclick="obtenerIdCategoria(${row.IdCategoria})">${row.NombreCategoria}</button>`;
                    $("#contenedorCategorias").append(btn);
                });
                $("#contenedorCategorias").prepend(verTodo);
            } else {
                mostrarAlertaZero("Error", response.d.Mensaje, "error");
            }
        }
    });
}

function obtenerIdCategoria(idCategoria) {
    if (idCategoria === 0) {
        renderizarListCardProductos(catalogoGlobal);
        return;
    }
    let productosFiltrados = catalogoGlobal.filter(c => c.IdCategoria === idCategoria);
    renderizarListCardProductos(productosFiltrados);
}

// 1. CARGAR CATÁLOGO DESDE LA BASE DE DATOS
function cargarCatalogoOriginal() {
    $("#contenedorListProduct").html('<div class="col-12 text-center py-5"><div class="spinner-border text-success" role="status"></div><p class="mt-2 text-muted">Cargando catálogo...</p></div>');

    $.ajax({
        type: "POST",
        url: "InicioCliente.aspx/ListarCatalogo", // Tendrás que crear este WebMethod
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#contenedorListProduct").empty();

            if (response.d.Estado) {
                catalogoGlobal = response.d.Data;

                if (catalogoGlobal.length === 0) {
                    $("#contenedorListProduct").html('<div class="col-12 text-center text-muted py-4">No hay productos disponibles por el momento.</div>');
                    return;
                }

                $.each(catalogoGlobal, function (i, item) {
                    let imgUrl = item.ImagenUrl && item.ImagenUrl !== "" ? item.ImagenUrl : "../Imagenes/sinimagen.png";
                    let badgeSabor = item.NombreSabor === "Sin Sabor" ? "bg-secondary" : "bg-warning";

                    let cardHtml = `
                        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-2">
                            <div class="card card-producto border" onclick="abrirModalCarrito(${item.IdVariante})">
                                <img src="${imgUrl}" class="img-catalogo bg-white border-bottom" alt="${item.NombreProducto}">
                                <div class="card-body p-3 d-flex flex-column">
                                    <p class="text-muted fs-15 mb-2"><span class="badge bg-secondary">${item.NombreCategoria}</span> | Bs. ${item.Precio.toFixed(2)}</p>
                                    <h5 class="fw-bold text-dark mb-1">${item.NombreProducto}</h5>
                                    <p class="text-muted fs-13 mb-0">${item.NombrePresentacion} | <span class="badge ${badgeSabor}">${item.NombreSabor}</span></p>
                                    
                                </div>
                            </div>
                        </div>
                    `;
                    $("#contenedorListProduct").append(cardHtml);
                });
            } else {
                $("#contenedorListProduct").html(`<div class="col-12 text-center text-danger">${response.d.Mensaje}</div>`);
            }
        },
        error: function () {
            $("#contenedorListProduct").html('<div class="col-12 text-center text-danger">Error de conexión al cargar el catálogo.</div>');
        }
    });
}

function cargarCatalogo() {

    $.ajax({
        type: "POST",
        url: "InicioCliente.aspx/ListarCatalogo", // Tendrás que crear este WebMethod
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                catalogoGlobal = response.d.Data;
                renderizarListCardProductos(catalogoGlobal);
            } else {
                $("#contenedorListProduct").html(`<div class="col-12 text-center text-danger">${response.d.Mensaje}</div>`);
            }
        },
        error: function () {
            $("#contenedorListProduct").html('<div class="col-12 text-center text-danger">Error de conexión al cargar el catálogo.</div>');
        }
    });
}

function renderizarListCardProductos(listaDibujar) {
    $("#contenedorListProduct").empty();

    if (listaDibujar.length === 0) {
        $("#contenedorListProduct").html('<div class="col-12 text-center text-muted py-4">No hay productos disponibles por el momento.</div>');
        return;
    }

    $.each(listaDibujar, function (i, item) {
        let imgUrl = item.ImagenUrl && item.ImagenUrl !== "" ? item.ImagenUrl : "../Imagenes/sinimagen.png";
        let badgeSabor = item.NombreSabor === "Sin Sabor" ? "bg-secondary" : "bg-warning";

        let cardHtml = `
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-2">
                <div class="card card-producto border" onclick="abrirModalCarrito(${item.IdVariante})">
                    <img src="${imgUrl}" class="img-catalogo bg-white border-bottom" alt="${item.NombreProducto}">
                    <div class="card-body p-3 d-flex flex-column">
                        <p class="text-muted fs-15 mb-2"><span class="badge bg-secondary">${item.NombreCategoria}</span> | Bs. ${item.Precio.toFixed(2)}</p>
                        <h5 class="fw-bold text-dark mb-1">${item.NombreProducto}</h5>
                        <p class="text-muted fs-13 mb-0">${item.NombrePresentacion} | <span class="badge ${badgeSabor}">${item.NombreSabor}</span></p>
                                    
                    </div>
                </div>
            </div>
        `;
        $("#contenedorListProduct").append(cardHtml);
    });
}

function abrirModalCarrito(idVariante) {
    // Buscar el producto en el array global
    const producto = catalogoGlobal.find(p => p.IdVariante === idVariante);
    if (!producto) return;

    // Llenar variables temporales y UI
    $("#txtIdVarianteTemporal").val(producto.IdVariante);
    $("#txtPrecioTemporal").val(producto.Precio);
    //$("#txtNombreCompletoTemporal").val(`${producto.NombreProducto} (${producto.NombrePresentacion})`);
    $("#txtNombreCompletoTemporal").val(`${producto.NombreProducto}`);
    $("#txtDetalleTemporal").val(`${producto.NombrePresentacion} - ${producto.NombreSabor}`);

    let imgUrl = producto.ImagenUrl && producto.ImagenUrl !== "" ? producto.ImagenUrl : "../Imagenes/sinimagen.png";
    $("#txtImagenTemporal").val(imgUrl);

    $("#lblModalNombre").text(producto.NombreProducto);
    $("#lblModalDetalle").text(`${producto.NombrePresentacion} - ${producto.NombreSabor}`);
    $("#lblModalPrecio").text(producto.Precio.toFixed(2));

    // Reiniciar cantidad a 1
    $("#txtCantidad").val(1);
    calcularTotalModal();

    $("#modalAgregarCarrito").modal("show");
}

// Controladores de cantidad (+ y -)
$("#btnMenosQty").on("click", function () {
    let qty = parseInt($("#txtCantidad").val());
    if (qty > 1) {
        $("#txtCantidad").val(qty - 1);
        calcularTotalModal();
    }
});

$("#btnMasQty").on("click", function () {
    let qty = parseInt($("#txtCantidad").val());
    $("#txtCantidad").val(qty + 1);
    calcularTotalModal();
});

function calcularTotalModal() {
    let qty = parseInt($("#txtCantidad").val());
    let precio = parseFloat($("#txtPrecioTemporal").val());
    let total = qty * precio;
    $("#lblModalTotal").text(total.toFixed(2));
}

// ==========================================
// 3. GUARDAR EN LOCALSTORAGE
// ==========================================
$("#btnConfirmarAgregar").on("click", function () {
    let idVariante = parseInt($("#txtIdVarianteTemporal").val());
    let nombre = $("#txtNombreCompletoTemporal").val();
    let detalles = $("#txtDetalleTemporal").val();
    let precio = parseFloat($("#txtPrecioTemporal").val());
    let cantidad = parseInt($("#txtCantidad").val());
    let img = $("#txtImagenTemporal").val();
    let total = precio * cantidad;

    // Recuperar carrito actual del LocalStorage
    let carrito = JSON.parse(localStorage.getItem("carritoTiendaEddy")) || [];

    // Verificar si el producto ya está en el carrito
    let index = carrito.findIndex(p => p.IdVariante === idVariante);

    if (index !== -1) {
        // Si ya existe, sumamos la cantidad
        carrito[index].Cantidad += cantidad;
        carrito[index].Total = carrito[index].Cantidad * carrito[index].Precio;
    } else {
        // Si es nuevo, lo agregamos al array
        carrito.push({
            IdVariante: idVariante,
            Nombre: nombre,
            Detalle: detalles,
            Imagen: img,
            Precio: precio,
            Cantidad: cantidad,
            Total: total
        });
    }

    // Guardar nuevamente en LocalStorage
    localStorage.setItem("carritoTiendaEddy", JSON.stringify(carrito));

    // Cerrar modal y avisar
    $("#modalAgregarCarrito").modal("hide");
    ToastMaster.fire({ icon: 'success', title: 'Producto agregado a tu pedido.' });

    actualizarContadorCarrito();
});

function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carritoTiendaEddy")) || [];
    let cantidadTotal = 0;

    // Sumamos la cantidad de todos los ítems (o puedes usar carrito.length si prefieres contar filas)
    carrito.forEach(item => {
        cantidadTotal += item.Cantidad;
    });

    $("#lblCantidadCarrito").text(cantidadTotal);
    //$("#lblCantCarrito").text(carrito.length);

    // Animación opcional para llamar la atención
    if (cantidadTotal > 0) {
        $("#btnIrAlCarrito").removeClass("btn-secondary").addClass("btn-success");
    }
}

// fin