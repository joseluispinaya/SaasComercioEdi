<%@ Page Title="" Language="C#" MasterPageFile="~/HomePage.Master" AutoEventWireup="true" CodeBehind="UsuariosPage.aspx.cs" Inherits="CapaPresentacion.UsuariosPage" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-header d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 border-bottom border-dashed">
                    <h4 class="header-title m-0 text-center text-sm-start">Lista de Usuarios Registrados</h4>
                    
                    <div class="d-flex flex-column flex-sm-row gap-2 text-center">
                        <button type="button" id="btnActualizar" class="btn btn-sm btn-secondary w-100 w-sm-auto">
                            <i class="ti ti-refresh me-1 align-middle"></i> Recargar
                        </button>
                        <button type="button" id="btnNuevoRegistro" class="btn btn-sm btn-info w-100 w-sm-auto">
                            Registrar <i class="ti ti-plus ms-1 align-middle"></i>
                        </button>
                    </div>
                </div>

                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle border-bottom w-100" id="tbUsuarios">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombres y Apellidos</th>
                                    <th>Nro. CI</th>
                                    <th>Rol</th>
                                    <th>Correo</th>
                                    <th>Contacto</th>
                                    <th>Estado</th>
                                    <th class="text-center" style="width: 120px;">Acciones</th>
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
    <!-- MODAL PARA NUEVO / EDITAR USUARIO                              -->
    <!-- ============================================================== -->
    <div id="modalUsuario" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabelUsuario" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabelUsuario">Detalle de Usuario</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body">
                    <input type="hidden" id="txtIdUsuario" value="0">

                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="txtNombres" class="form-label mb-1 text-muted fw-semibold">Nombres <span class="text-danger">*</span></label>
                            <input type="text" id="txtNombres" name="Nombres" class="form-control model" placeholder="Nombres">
                        </div>
                        <div class="col-md-6">
                            <label for="txtApellidos" class="form-label mb-1 text-muted fw-semibold">Apellidos <span class="text-danger">*</span></label>
                            <input type="text" id="txtApellidos" name="Apellidos" class="form-control model" placeholder="Apellidos">
                        </div>

                        <div class="col-md-6">
                            <label for="txtNroCI" class="form-label mb-1 text-muted fw-semibold">Nro CI <span class="text-danger">*</span></label>
                            <input type="text" id="txtNroCI" name="Nro CI" class="form-control model" placeholder="Carnet de Identidad">
                            <small class="text-muted fs-12" id="lblInfoClave">La contraseña por defecto será este Nro de CI.</small>
                        </div>
                        <div class="col-md-6">
                            <label for="cboRol" class="form-label mb-1 text-muted fw-semibold">Rol de Usuario <span class="text-danger">*</span></label>
                            <select id="cboRol" name="Rol" class="form-select model">
                                <!-- Llenado por AJAX -->
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label for="txtCorreo" class="form-label mb-1 text-muted fw-semibold">Correo Electrónico <span class="text-danger">*</span></label>
                            <input type="email" id="txtCorreo" name="Correo" class="form-control model" placeholder="correo@ejemplo.com">
                        </div>
                        <div class="col-md-6">
                            <label for="txtNroContacto" class="form-label mb-1 text-muted fw-semibold">Nro Contacto <span class="text-danger">*</span></label>
                            <input type="number" id="txtNroContacto" name="Contacto" class="form-control model" placeholder="Celular o Teléfono">
                        </div>

                        <div class="col-md-12 text-center mt-3">
                            <label class="form-label mb-2 text-muted fw-semibold d-block">Estado del Usuario</label>
                            <div class="d-flex align-items-center justify-content-center gap-2">
                                <span class="text-muted fw-medium fs-13">Inactivo</span>
                                <div>
                                    <input type="checkbox" id="chkEstado" checked data-switch="success" />
                                    <label for="chkEstado" data-on-label="" data-off-label="" class="mb-0 align-middle"></label>
                                </div>
                                <span class="text-success fw-bold fs-13">Activo</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer border-top border-dashed">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                        <i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Cancelar
                    </button>
                    <button type="button" id="btnGuardarUsuario" class="btn btn-sm btn-success">
                        <i class="ti ti-device-floppy fs-16 align-middle me-1"></i>Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/UsuariosPage.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
