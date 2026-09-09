<%@ Page Title="" Language="C#" MasterPageFile="~/HomePage.Master" AutoEventWireup="true" CodeBehind="ListaProductos.aspx.cs" Inherits="CapaPresentacion.ListaProductos" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style>
        .img-thumbnail-dt {
            width: 45px;
            height: 45px;
            object-fit: contain;
            border-radius: 6px;
            border: 1px solid #dee2e6;
        }
        .img-detalle {
            width: 100%;
            max-width: 150px;
            height: 150px;
            object-fit: contain;
            border-radius: 8px;
            border: 2px dashed #dee2e6;
            padding: 4px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-header d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 border-bottom border-dashed">
                    <h4 class="header-title m-0 text-center text-sm-start">Catálogo de Productos</h4>
                    
                    <div class="d-flex flex-column flex-sm-row gap-2 text-center">
                        <button type="button" id="btnActualizar" class="btn btn-sm btn-secondary w-100 w-sm-auto">
                            <i class="ti ti-refresh me-1 align-middle"></i> Recargar
                        </button>
                        <a href="ProductoPage.aspx" class="btn btn-sm btn-info w-100 w-sm-auto">
                            Agregar <i class="ti ti-plus ms-1 align-middle"></i>
                        </a>
                    </div>
                </div>

                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle border-bottom w-100" id="tbProductos">
                            <thead>
                                <tr>
                                    <th style="width: 50px;">Img</th>
                                    <th>Categoría</th>
                                    <th>Nombre del Producto</th>
                                    <th class="text-center">Variantes</th>
                                    <th class="text-center">Estado</th>
                                    <th class="text-center" style="width: 100px;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Llenado por AJAX -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================================== -->
    <!-- MODAL DE DETALLE DEL PRODUCTO                                  -->
    <!-- ============================================================== -->
    <div id="modalDetalleProducto" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabelDetalle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-light border-bottom-0 pb-3">
                    <h5 class="modal-title" id="modalLabelDetalle">Información del Producto</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body pt-0">
                    
                    <!-- CABECERA DEL DETALLE -->
                    <div class="row align-items-center mb-4 bg-light rounded p-3 mx-0">
                        <div class="col-sm-3 text-center text-sm-start mb-3 mb-sm-0">
                            <img id="imgDetalleFoto" src="Imagenes/sinimagen.png" class="img-detalle bg-white" alt="Producto">
                        </div>
                        <div class="col-sm-9 text-center text-sm-start">
                            <h4 id="lblDetalleNombre" class="fw-bold mb-1 text-dark">Nombre del Producto</h4>
                            <p class="mb-2 text-muted"><i class="ti ti-box me-1"></i> Categoría: <span id="lblDetalleCategoria" class="fw-medium text-primary">---</span></p>
                            <span id="lblDetalleEstado" class="badge bg-success px-2 py-1 fs-12">Activo</span>
                        </div>
                    </div>

                    <!-- TABLA DE VARIANTES -->
                    <h5 class="fs-15 text-secondary mb-3"><i class="ti ti-layers-intersect me-1"></i>Variantes Disponibles</h5>
                    <div class="table-responsive border rounded">
                        <table class="table table-sm table-hover align-middle text-center mb-0" id="tbVariantesDetalle">
                            <thead class="table-light">
                                <tr>
                                    <th>Presentación</th>
                                    <th>Sabor</th>
                                    <th>Precio (Bs.)</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Llenado por AJAX dinámicamente -->
                            </tbody>
                        </table>
                    </div>

                </div>
                
                <div class="modal-footer border-top border-dashed">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                        <i class="ti ti-arrow-left fs-16 align-middle me-1"></i>Cerrar Detalle
                    </button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/ListaProductos.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
