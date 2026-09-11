<%@ Page Title="" Language="C#" MasterPageFile="~/HomePage.Master" AutoEventWireup="true" CodeBehind="ListaPedidos.aspx.cs" Inherits="CapaPresentacion.ListaPedidos" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style>
        .card-pedido {
            cursor: pointer;
            transition: transform 0.2s ease;
            border-left: 4px solid transparent;
        }
        .card-pedido:hover {
            transform: translateY(-3px);
            border-color: #6c757d;
        }
        /* Colores indicadores por estado */
        .border-pendiente { border-left-color: #ffc107 !important; }
        .border-camino { border-left-color: #0dcaf0 !important; }
        .border-entregado { border-left-color: #198754 !important; }
        .border-cancelado { border-left-color: #dc3545 !important; }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <!-- FILTRO DE ESTADOS -->
    <div class="row mb-4">
        <div class="col-lg-4 col-md-6">
            <div class="input-group">
                <span class="input-group-text bg-light fw-bold">Filtrar por Estado</span>
                <select id="cboFiltroEstado" class="form-select border-start-0">
                    <option value="0">Todos los pedidos</option>
                    <option value="1" selected>1. Pendientes</option>
                    <option value="3">2. En Camino</option>
                    <option value="2">3. Entregados</option>
                    <option value="4">4. Cancelados</option>
                </select>
            </div>
        </div>
    </div>

    <!-- CONTENEDOR DE TARJETAS (CARDS) -->
    <div class="row g-3" id="contenedorPedidos">
        <!-- Renderizado por AJAX -->
    </div>

    <!-- MODAL DE DETALLE Y GESTIÓN -->
    <div class="modal fade" id="modalGestionPedido" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-light pb-3">
                    <h5 class="modal-title fw-bold text-dark" id="lblModalTitulo">Pedido #000 - Nombre Cliente</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    
                    <!-- INFO CABECERA -->
                    <div class="row mb-3 align-items-center border-bottom border-dashed pb-3">
                        <div class="col-md-6">
                            <p class="mb-1 text-muted fs-13">Fecha y Hora:</p>
                            <h6 class="fw-bold text-dark mb-2" id="lblModalFecha">--/--/---- --:--</h6>

                            <!-- Botón de Ubicación -->
                            <button type="button" id="btnVerUbicacion" class="btn btn-sm btn-outline-info">
                                <i class="ti ti-map-pin me-1"></i>Ver Ubicación en Mapa
       
                            </button>
                        </div>
                        <div class="col-md-6 text-md-end mt-3 mt-md-0">
                            <p class="mb-1 text-muted fs-13">Total del Pedido:</p>
                            <h4 class="fw-bold text-success m-0">Bs. <span id="lblModalTotal">0.00</span></h4>
                        </div>
                    </div>

                    <!-- TABLA DETALLES -->
                    <div class="table-responsive border rounded mb-4">
                        <table class="table table-sm table-hover align-middle text-center mb-0" id="tbDetallePedido">
                            <thead class="table-light">
                                <tr>
                                    <th class="text-start ps-3">Producto</th>
                                    <th>P.U. (Bs.)</th>
                                    <th>Cantidad</th>
                                    <th class="text-end pe-3">SubTotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Renderizado por AJAX -->
                            </tbody>
                        </table>
                    </div>

                    <!-- ZONA DE CAMBIO DE ESTADO -->
                    <div id="divGestionEstado" class="bg-light p-3 rounded border border-dashed">
                        <h6 class="fw-bold text-dark mb-3"><i class="ti ti-settings me-1"></i>Gestión del Pedido</h6>
                        
                        <div class="row align-items-center">
                            <div class="col-md-7">
                                <label class="form-label text-muted fs-13 mb-1">Cambiar estado a:</label>
                                <select id="cboCambiarEstado" class="form-select form-select-sm">
                                    <!-- Como lo usan los repartidores, el flujo más lógico -->
                                    <option value="3">En Camino</option>
                                    <option value="2">Entregado</option>
                                    <option value="4">Cancelado</option>
                                </select>
                            </div>
                            <div class="col-md-5 text-end mt-3 mt-md-0">
                                <button type="button" id="btnGuardarEstado" class="btn btn-primary fw-bold mt-3">
                                    <i class="ti ti-check me-1"></i> Actualizar Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- MENSAJE ESTADO FINALIZADO (Oculto por defecto) -->
                    <div id="divEstadoFinalizado" class="alert alert-info border-0 text-center mb-0 d-none">
                        <i class="ti ti-info-circle fs-20 mb-2"></i>
                        <h6 class="fw-bold m-0" id="lblMensajeFinalizado">Este pedido ya fue gestionado y no puede ser modificado.</h6>
                    </div>

                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/ListaPedidos.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
