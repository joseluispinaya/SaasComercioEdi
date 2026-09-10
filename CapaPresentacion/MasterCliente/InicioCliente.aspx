<%@ Page Title="" Language="C#" MasterPageFile="~/MasterCliente/HomeCliente.Master" AutoEventWireup="true" CodeBehind="InicioCliente.aspx.cs" Inherits="CapaPresentacion.MasterCliente.InicioCliente" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style>
        .card-producto {
            transition: transform 0.2s ease-in-out;
            cursor: pointer;
            /*height: 100%;*/
        }
        .card-producto:hover {
            transform: translateY(-5px);
            border-color: #28a745 !important;
        }
        .img-catalogo {
            width: 100%;
            height: 140px;
            object-fit: contain;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        /* Botón flotante para el carrito */
        .btn-flotante-carrito {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 1000;
            border-radius: 50px;
            padding: 12px 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row mb-3 align-items-center">
        <div class="col-12">
            <h4 class="page-title fw-bold">¿Qué deseas pedir hoy?</h4>
            <p class="text-muted">Selecciona los productos para agregarlos a tu pedido.</p>
        </div>
    </div>

    <!-- CONTENEDOR DEL CATÁLOGO -->
    <div class="card">
        <div class="card-body bg-light">
            <div class="row g-3" id="contenedorListProduct">
                <!-- Se llenará dinámicamente con AJAX -->
            </div>
        </div>
    </div>

    <!-- BOTÓN FLOTANTE DEL CARRITO -->
    <button type="button" id="btnIrAlCarrito" class="btn btn-success btn-flotante-carrito fw-bold fs-15">
        <i class="ti ti-shopping-cart me-2 fs-20 align-middle"></i> Ver Pedido 
        <span id="lblCantidadCarrito" class="badge bg-white text-success ms-2 rounded-pill fs-13">0</span>
    </button>

    <!-- ============================================================== -->
    <!-- MODAL AGREGAR AL CARRITO                                       -->
    <!-- ============================================================== -->
    <div class="modal fade" id="modalAgregarCarrito" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content">
                <div class="modal-header border-bottom-0 pb-0">
                    <h5 class="modal-title fw-bold text-success">Agregar al Pedido</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center pt-2">
                    
                    <input type="hidden" id="txtIdVarianteTemporal">
                    <input type="hidden" id="txtPrecioTemporal">
                    <input type="hidden" id="txtNombreCompletoTemporal">
                    <input type="hidden" id="txtImagenTemporal">
                    <input type="hidden" id="txtDetalleTemporal">

                    <h5 id="lblModalNombre" class="fw-bold mb-1">Nombre Producto</h5>
                    <p id="lblModalDetalle" class="text-muted fs-13 mb-3">Presentación - Sabor</p>
                    
                    <h4 class="text-success fw-bold mb-3">Bs. <span id="lblModalPrecio">0.00</span></h4>

                    <div class="mb-3 text-start">
                        <label class="form-label fw-semibold text-muted mb-1">Cantidad:</label>
                        <div class="input-group">
                            <button class="btn btn-outline-secondary" type="button" id="btnMenosQty"><i class="ti ti-minus"></i></button>
                            <input type="number" class="form-control text-center fw-bold" id="txtCantidad" value="1" min="1" readonly>
                            <button class="btn btn-outline-secondary" type="button" id="btnMasQty"><i class="ti ti-plus"></i></button>
                        </div>
                    </div>

                    <div class="bg-light p-2 rounded mb-3">
                        <span class="text-muted fw-semibold">Total a pagar: </span>
                        <h5 class="text-dark fw-bold m-0 mt-1">Bs. <span id="lblModalTotal">0.00</span></h5>
                    </div>

                    <div class="d-grid">
                        <button type="button" id="btnConfirmarAgregar" class="btn btn-success fw-bold">
                            <i class="ti ti-check me-1"></i> Confirmar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="jsClien/InicioCliente.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
