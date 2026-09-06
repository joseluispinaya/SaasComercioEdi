<%@ Page Title="" Language="C#" MasterPageFile="~/HomePage.Master" AutoEventWireup="true" CodeBehind="CategoriaPage.aspx.cs" Inherits="CapaPresentacion.CategoriaPage" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <!-- Inicio del Título de la Página -->
    <div class="row">
        <div class="col-12">
            <div class="page-title-box">
                <div class="page-title-right">
                    <ol class="breadcrumb m-0">
                        <li class="breadcrumb-item"><a href="Inicio.aspx">Tienda Eddy</a></li>
                        <li class="breadcrumb-item"><a href="javascript:void(0);">Configuración</a></li>
                        <li class="breadcrumb-item active">Categorías</li>
                    </ol>
                </div>
                <h4 class="page-title">Gestión de Categorías</h4>
            </div>
        </div>
    </div>
    <!-- Fin del Título de la Página -->

    <!-- Inicio de la Tarjeta Principal -->
    <div class="row">
        <div class="col-12">
            <!-- Quitamos 'shadow-sm' para que el template aplique su sombra por defecto -->
            <div class="card">
                <div class="card-header border-bottom border-dashed d-flex align-items-center">
                    <h4 class="header-title me-auto">Lista de Categorías Registradas</h4>
                    
                    <!-- Botones con los colores nativos del template (secondary e info) -->
                    <div class="d-flex gap-2 justify-content-end text-end">
                        <button type="button" id="btnActualizar" class="btn btn-sm btn-secondary">
                            <i class="ti ti-refresh ms-1 align-middle"></i> Actualizar
                        </button>
                        <button type="button" id="btnNuevoRegistro" class="btn btn-sm btn-info">
                            Nueva Categoría <i class="ti ti-plus ms-1 align-middle"></i>
                        </button>
                    </div>
                </div>

                <div class="card-body">
                    <!-- Tabla DataTables (Quitamos table-light del thead para el modo oscuro) -->
                    <table id="tbCategorias" class="table table-striped table-hover dt-responsive nowrap w-100">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre de Categoría</th>
                                <th>Estado</th>
                                <th class="text-center" style="width: 100px;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Se llenará mediante AJAX -->
                        </tbody>
                    </table>
                </div> <!-- end card-body -->
            </div> <!-- end card -->
        </div> <!-- end col -->
    </div>
    <!-- Fin de la Tarjeta Principal -->

    <!-- ============================================================== -->
    <!-- INICIO DEL MODAL PARA NUEVO / EDITAR CATEGORÍA                 -->
    <!-- ============================================================== -->
    <div id="modalCategoria" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabelCategoria" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <!-- El modal-content también hereda la sombra sólida del template -->
            <div class="modal-content">
                <!-- Quitamos bg-light para que el modo oscuro pinte la cabecera correctamente -->
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabelCategoria">Detalle de Categoría</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body">
                    <input type="hidden" id="txtIdCategoria" value="0">

                    <div class="row">
                        <div class="mb-3 col-md-12">
                            <label for="txtNombreCategoria" class="form-label mb-1 text-muted fw-semibold">Nombre de la Categoría <span class="text-danger">*</span></label>
                            <!-- Agregado el atributo 'name' para tu validación serializeArray() -->
                            <input type="text" id="txtNombreCategoria" name="Nombre de Categoría" class="form-control model" placeholder="Ej: Gaseosas, Cigarrillos, etc.">
                        </div>

                        <div class="mb-1 col-md-12">
                            <label class="form-label mb-1 text-muted fw-semibold d-block">Estado</label>
                            <input type="checkbox" id="chkEstado" checked data-switch="success" />
                            <label for="chkEstado" data-on-label="Si" data-off-label="No"></label>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer border-top border-dashed">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                        <i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Cancelar
                    </button>
                    <button type="button" id="btnGuardarCategoria" class="btn btn-sm btn-success">
                        <i class="ti ti-device-floppy fs-16 align-middle me-1"></i>Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- FIN DEL MODAL -->
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/Categoria.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
