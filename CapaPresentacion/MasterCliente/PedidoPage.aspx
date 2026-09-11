<%@ Page Title="" Language="C#" MasterPageFile="~/MasterCliente/HomeCliente.Master" AutoEventWireup="true" CodeBehind="PedidoPage.aspx.cs" Inherits="CapaPresentacion.MasterCliente.PedidoPage" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style>
        .img-carrito {
            width: 60px;
            height: 60px;
            object-fit: contain;
            border-radius: 8px;
            border: 1px solid #dee2e6;
        }

        .btn-qty {
            width: 32px;
            height: 32px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .input-qty {
            width: 15px !important;
            text-align: center;
            padding: 0.25rem;
            font-weight: bold;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <!-- ESTADO: CARRITO VACÍO (Oculto por defecto) -->
    <div id="divCarritoVacio" class="card d-none">
        <div class="card-body text-center py-5">
            <div class="mb-4">
                <i class="ti ti-shopping-cart-x text-muted" style="font-size: 5rem;"></i>
            </div>
            <h4 class="text-dark fw-bold">Tu carrito está vacío</h4>
            <p class="text-muted mb-4">Parece que aún no has agregado ningún producto a tu pedido.</p>
            <a href="InicioCliente.aspx" class="btn btn-primary">
                <i class="ti ti-arrow-left me-1"></i> Volver al Catálogo
            </a>
        </div>
    </div>

    <!-- ESTADO: CON PRODUCTOS -->
    <div id="divContenidoPedido" class="row g-4">
        
        <!-- COLUMNA IZQUIERDA: Detalle de Productos -->
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header border-bottom border-dashed">
                    <h5 class="card-title m-0 fw-bold text-dark"><i class="ti ti-list me-2"></i>Productos Agregados</h5>
                </div>
                <div class="card-body p-1">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0" id="tbDetallePedido">
                            <thead class="table-light text-center">
                                <tr>
                                    <th class="text-start ps-3">Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th style="width: 50px;"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Llenado por AJAX / LocalStorage -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-footer bg-light border-top border-dashed text-start">
                    <a href="InicioCliente.aspx" class="btn btn-sm btn-outline-primary fw-medium">
                        <i class="ti ti-plus me-1"></i> Agregar más productos
                    </a>
                </div>
            </div>
        </div>

        <!-- COLUMNA DERECHA: Resumen y Acción -->
        <div class="col-lg-4">
            <div class="card border-primary border">
                <div class="card-header bg-primary text-white text-center">
                    <h5 class="card-title m-0 text-white fw-bold"><i class="ti ti-receipt me-1"></i>Resumen del Pedido</h5>
                </div>
                <div class="card-body">
                    
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted fw-medium">Subtotal:</span>
                        <span class="text-dark fw-bold">Bs. <span id="lblSubtotal">0.00</span></span>
                    </div>
                    
                    <div class="d-flex justify-content-between mb-3 pb-3 border-bottom border-dashed">
                        <span class="text-muted fw-medium">Cliente:</span>
                        <span id="lblInfoPropietario" class="text-success fw-bold">A coordinar</span>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-dark fs-16 fw-bold">Total a Pagar:</span>
                        <h3 class="text-dark m-0 fw-bold">Bs. <span id="lblTotalGeneral">0.00</span></h3>
                    </div>

                    <div class="alert alert-soft-warning fs-13 mb-3" role="alert">
                        <i class="ti ti-info-circle me-1 fw-bold"></i> Verifique sus productos antes de enviar el pedido.
                    </div>

                    <div class="d-grid">
                        <button type="button" id="btnEnviarPedido" class="btn btn-success btn-lg fw-bold">
                            Enviar Pedido <i class="ti ti-send ms-1"></i>
                        </button>
                    </div>

                </div>
            </div>
        </div>

    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="jsClien/Pedido.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
