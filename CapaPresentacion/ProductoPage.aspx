<%@ Page Title="" Language="C#" MasterPageFile="~/HomePage.Master" AutoEventWireup="true" CodeBehind="ProductoPage.aspx.cs" Inherits="CapaPresentacion.ProductoPage" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style>
        .img-preview {
            width: 100%;
            max-width: 200px; /* Tamaño controlado para la columna central */
            height: 180px;
            object-fit: contain;
            border-radius: 8px;
            border: 2px dashed #dee2e6;
            padding: 4px;
        }
        /* Ajuste sutil para los input-group de las variantes */
        .input-group-text-fixed {
            width: 115px; /* Para que todas las etiquetas queden alineadas */
            justify-content: flex-start;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <!-- TARJETA PRINCIPAL: DATOS Y VARIANTES (Sin shadow-sm para respetar Boron) -->
    <div class="card">
        <div class="card-body" id="contenedorFormulario">
            
            <!-- ========================================== -->
            <!-- FILA SUPERIOR: 3 COLUMNAS -->
            <!-- ========================================== -->
            <div class="row g-4 mb-2 border-bottom border-dashed pb-2">
                
                <!-- COLUMNA 1: Datos Generales e Input File -->
                <div class="col-lg-4">
                    <h5 class="mb-3 fs-15 text-primary"><i class="ti ti-box me-1"></i>Datos Generales</h5>
                    
                    <div class="mb-2">
                        <label for="cboCategoria" class="form-label mb-1 text-muted fw-semibold">Categoría <span class="text-danger">*</span></label>
                        <select id="cboCategoria" name="Categoría" class="form-select model">
                            <!-- Llenado por AJAX -->
                        </select>
                    </div>
                    
                    <div class="mb-2">
                        <label for="txtNombreProducto" class="form-label mb-1 text-muted fw-semibold">Nombre del Producto <span class="text-danger">*</span></label>
                        <input type="text" id="txtNombreProducto" name="Nombre del Producto" class="form-control model" placeholder="Ej: Coca Machucada Clásica">
                    </div>

                    <div class="mb-2">
                        <label for="txtFoto" class="form-label mb-1 text-muted fw-semibold">Seleccionar Imagen</label>
                        <input class="form-control form-control-sm" type="file" id="txtFoto" accept="image/png, image/jpeg, image/jpg">
                        <small class="text-muted fs-12 mt-1 d-block">Max: 2MB. Formatos: JPG, PNG.</small>
                    </div>
                </div>

                <!-- COLUMNA 2: Vista Previa de la Imagen -->
                <div class="col-lg-4 d-flex flex-column align-items-center justify-content-center border-start border-end border-dashed">
                    <h5 class="mb-3 fs-15 text-primary w-100 text-start ps-lg-3"><i class="ti ti-photo me-1"></i>Vista Previa</h5>
                    <img id="imgFoto" src="Imagenes/sinimagen.png" class="img-preview" alt="Vista previa">
                </div>

                <!-- COLUMNA 3: Formulario de Variantes (Input Group) -->
                <div class="col-lg-4">
                    <h5 class="mb-3 fs-15 text-success"><i class="ti ti-layers-intersect me-1"></i>Agregar Variante</h5>
                    
                    <div class="input-group input-group-sm mb-3">
                        <span class="input-group-text bg-light fw-semibold text-muted input-group-text-fixed">Presentación <span class="text-danger ms-1">*</span></span>
                        <select id="cboPresentacion" class="form-select">
                            <!-- Llenado por AJAX -->
                        </select>
                    </div>
                    
                    <div class="input-group input-group-sm mb-3">
                        <span class="input-group-text bg-light fw-semibold text-muted input-group-text-fixed">Sabor (Opcional)</span>
                        <select id="cboSabor" class="form-select">
                            <option value="0">Ninguno / Sin sabor</option>
                            <!-- Llenado por AJAX -->
                        </select>
                    </div>

                    <div class="input-group input-group-sm mb-4">
                        <span class="input-group-text bg-light fw-semibold text-muted input-group-text-fixed">Precio (Bs.) <span class="text-danger ms-1">*</span></span>
                        <input type="number" id="txtPrecio" class="form-control" placeholder="0.00" step="0.50" min="0">
                    </div>

                    <div class="d-grid">
                        <button type="button" id="btnAgregarVariante" class="btn btn-sm btn-info">
                            <i class="ti ti-plus me-1 align-middle"></i> Agregar a la tabla
                        </button>
                    </div>
                </div>

            </div>

            <!-- ========================================== -->
            <!-- FILA INFERIOR: TABLA Y CONTROLES -->
            <!-- ========================================== -->
            <div class="row g-4 mt-2">
                
                <!-- COLUMNA IZQUIERDA: Tabla de Variantes (Ocupa 8 columnas) -->
                <div class="col-lg-8">
                    <h5 class="mb-3 fs-15 text-secondary"><i class="ti ti-list me-1"></i>Variantes Agregadas al Producto</h5>
                    <div class="table-responsive">
                        <table class="table table-hover table-sm align-middle border-bottom text-center" id="tbVariantes">
                            <thead>
                                <tr>
                                    <th>Presentación</th>
                                    <th>Sabor</th>
                                    <th>Precio (Bs.)</th>
                                    <th style="width: 80px;">Quitar</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr id="trVacioVariantes">
                                    <td colspan="4" class="text-muted py-4"><i class="ti ti-info-circle me-1"></i>Aún no has agregado ninguna variante.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- COLUMNA DERECHA: Aviso y Botones (Ocupa 4 columnas) -->
                <div class="col-lg-4 d-flex flex-column">
                    
                    <!-- Alerta Informativa (Ocupa el espacio vacío) -->
                    <div class="alert alert-info border-0 text-start" role="alert">
                        <div class="d-flex align-items-center mb-2">
                            <i class="ti ti-info-circle fs-20 me-2 text-info"></i>
                            <h5 class="m-0 fw-bold text-info">Información</h5>
                        </div>
                        <p class="mb-0 fs-13 text-muted">Asegúrate de agregar al menos una variante (presentación y precio) a la tabla. Los productos sin variantes no podrán ser comprados por los clientes.</p>
                    </div>

                    <!-- Botones de Acción Moviéndose a esta zona -->
                    <div class="d-grid gap-2 mt-auto pt-3 border-top border-dashed">
                        <button type="button" id="btnGuardarProducto" class="btn btn-success fw-bold" disabled>
                            <i class="ti ti-device-floppy me-1"></i> Guardar Producto
                        </button>
                        <a href="ListaProductos.aspx" class="btn btn-secondary">
                            <i class="ti ti-arrow-left me-1"></i> Volver a la Lista
                        </a>
                    </div>
                    
                </div>
            </div>

        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/Producto.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
