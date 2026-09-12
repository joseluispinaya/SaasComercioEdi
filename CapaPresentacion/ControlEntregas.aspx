<%@ Page Title="" Language="C#" MasterPageFile="~/HomePage.Master" AutoEventWireup="true" CodeBehind="ControlEntregas.aspx.cs" Inherits="CapaPresentacion.ControlEntregas" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style>
        .card-pedido { cursor: pointer; transition: transform 0.2s ease; border-left: 4px solid #198754; }
        .card-pedido:hover { transform: translateY(-3px); border-color: #198754; }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <!-- ZONA DE FILTROS -->
    <div class="card mb-4">
        <div class="card-body">
            <div class="row g-3 align-items-end">
                <div class="col-lg-4 col-md-5">
                    <label for="cboRepartidor" class="form-label text-muted fw-semibold">Repartidor <span class="text-danger">*</span></label>
                    <select id="cboRepartidor" class="form-select">
                        <option value="">Cargando repartidores...</option>
                    </select>
                </div>

                <div class="col-lg-3 col-md-4">
                    <label for="txtFecha" class="form-label text-muted fw-semibold">Fecha de Entrega <span class="text-danger">*</span></label>
                    <div class="input-group">
                        <span class="input-group-text bg-light border-end-0"><i class="ti ti-calendar"></i></span>
                        <input type="text" id="txtFecha" class="form-control border-start-0" readonly style="background-color: white;">
                    </div>
                </div>

                <div class="col-lg-2 col-md-3">
                    <button type="button" id="btnBuscar" class="btn btn-primary w-100 fw-bold">
                        <i class="ti ti-search me-1"></i> Buscar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- CONTENEDOR DE RESULTADOS -->
    <div class="row g-3" id="contenedorPedidos">
        <div class="col-12 text-center text-muted py-5">
            <i class="ti ti-filter fs-24 mb-2 d-block"></i>
            Seleccione un repartidor y una fecha para ver las entregas.
        </div>
    </div>

    <!-- MODAL DETALLE DE ENTREGA -->
    <div class="modal fade" id="modalDetalleEntrega" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-light pb-3">
                    <h5 class="modal-title fw-bold text-dark" id="lblModalTitulo">Pedido Entregado</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    
                    <div class="row mb-3 align-items-center border-bottom border-dashed pb-3">
                        <div class="col-md-6">
                            <p class="mb-1 text-muted fs-13">Entregado el:</p>
                            <h6 class="fw-bold text-dark mb-2" id="lblModalFecha">--/--/---- --:--</h6>
                            <button type="button" id="btnVerUbicacion" class="btn btn-sm btn-outline-info">
                                <i class="ti ti-map-pin me-1"></i> Ver Ubicación
                            </button>
                        </div>
                        <div class="col-md-6 text-md-end mt-3 mt-md-0">
                            <p class="mb-1 text-muted fs-13">Total Cobrado:</p>
                            <h4 class="fw-bold text-success m-0">Bs. <span id="lblModalTotal">0.00</span></h4>
                        </div>
                    </div>

                    <div class="table-responsive border rounded mb-0">
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
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="assets/vendor/flatpickr/l10n/es.js"></script>
    <script src="js/ControlEntregas.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
