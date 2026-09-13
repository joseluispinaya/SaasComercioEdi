<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RegistroPage.aspx.cs" Inherits="CapaPresentacion.RegistroPage" %>

<!DOCTYPE html>

<html lang="es">

<head>
    <meta charset="utf-8" />
    <title>Registro de Cliente | Tienda Eddy</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="Registro de nuevos clientes para Tienda Eddy" name="description" />
    
    <!-- App favicon -->
    <link rel="shortcut icon" href="assets/images/favicon.ico">
    <link href="assets/vendor/sweetalert2/sweetalert2.min.css" rel="stylesheet" type="text/css" />

    <!-- Theme Config Js -->
    <script src="assets/js/config.js"></script>

    <!-- Vendor css -->
    <link href="assets/css/vendor.min.css" rel="stylesheet" type="text/css" />

    <!-- App css -->
    <link href="assets/css/app.min.css" rel="stylesheet" type="text/css" id="app-style" />

    <!-- Icons css -->
    <link href="assets/css/icons.min.css" rel="stylesheet" type="text/css" />
</head>

<body class="h-100">

    <!-- Contenedor principal con fondo de autenticación -->
    <div class="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
        <!-- Hacemos la columna más ancha (col-xl-9) para que quepa el mapa y el formulario lado a lado -->
        <div class="row g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
            <div class="col-xl-10 col-lg-12 col-md-12">
                <div class="card overflow-hidden h-100 p-xxl-4 p-3 mb-0">
                    
                    <div class="text-center mb-4">
                        <a href="Default.aspx" class="auth-brand mb-3">
                            <img src="assets/images/logo-dark.png" alt="dark logo" height="30" class="logo-dark">
                            <img src="assets/images/logo.png" alt="logo light" height="30" class="logo-light">
                        </a>
                        <h4 class="fw-semibold mb-2">Crea tu cuenta en Tienda Eddy</h4>
                        <p class="text-muted mb-0">Completa tus datos y ubica tu negocio en el mapa para asegurar tus entregas.</p>
                    </div>

                    <div class="text-start">
                        <div class="row g-4">
                            
                            <!-- COLUMNA IZQUIERDA: Formulario de Datos -->
                            <div class="col-lg-6 border-end border-dashed pe-lg-4">
                                <h5 class="mb-3 fs-15 text-primary"><i class="ti ti-user me-1"></i>Datos Personales</h5>
                                
                                <div class="mb-2">
                                    <label class="form-label" for="txtNombreCompleto">Nombre Completo <span class="text-danger">*</span></label>
                                    <input type="text" id="txtNombreCompleto" name="Nombre Completo" class="form-control model" placeholder="Ej: Juan Pérez">
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-2">
                                        <label class="form-label" for="txtNroCI">Nro CI <span class="text-danger">*</span></label>
                                        <input type="text" id="txtNroCI" name="Nro CI" class="form-control model" placeholder="Carnet de Identidad">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label class="form-label" for="txtNroContacto">Nro Contacto <span class="text-danger">*</span></label>
                                        <input type="number" id="txtNroContacto" name="Nro Contacto" class="form-control model" placeholder="Celular o Teléfono">
                                    </div>
                                </div>

                                <div class="mb-2">
                                    <label class="form-label" for="txtCorreo">Correo Electrónico <span class="text-danger">*</span></label>
                                    <input type="email" id="txtCorreo" name="Correo" class="form-control model" placeholder="tucorreo@ejemplo.com">
                                </div>

                                <div class="mb-2">
                                    <label class="form-label" for="txtClave">Contraseña <span class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <input type="password" id="txtClave" name="Contraseña" class="form-control model" placeholder="Crea una contraseña segura">
                                        <button class="btn btn-outline-secondary" type="button" id="btnTogglePassword"><i class="ti ti-eye"></i></button>
                                    </div>
                                </div>

                                <div class="mb-2">
                                    <label class="form-label" for="txtUbicacionNegocio">Referencia del Negocio <span class="text-danger">*</span></label>
                                    <textarea id="txtUbicacionNegocio" name="Referencia" class="form-control model" rows="2" placeholder="Ej: Tienda color verde, frente a la plaza..."></textarea>
                                </div>
                            </div>

                            <!-- COLUMNA DERECHA: Mapa y Coordenadas -->
                            <div class="col-lg-6 ps-lg-4">
                                <h5 class="mb-2 fs-15 text-danger"><i class="ti ti-map-pin me-1"></i>Ubicación Geográfica <span class="text-danger">*</span></h5>

                                <div class="d-flex justify-content-between align-items-end mb-2">
                                    <p class="text-muted fs-13 mb-0 pe-2">Mueve el marcador o usa tu GPS para fijar la ubicación.</p>

                                    <!-- Nuevo Botón de GPS -->
                                    <button type="button" id="btnUbicacion" class="btn btn-sm btn-soft-primary text-nowrap shadow-none">
                                        <i class="ti ti-current-location me-1"></i>Mi Ubicación
                                    </button>
                                </div>

                                <!-- Contenedor del Mapa -->
                                <div id="mapa" class="gmaps mb-3 shadow-sm border" style="height: 280px; border-radius: 8px;"></div>

                                <div class="row g-2 mb-2">
                                    <div class="col-6">
                                        <div class="input-group input-group-sm">
                                            <span class="input-group-text bg-light fw-semibold">Lat</span>
                                            <input type="text" class="form-control model" name="Latitud" id="txtLatitud" readonly>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="input-group input-group-sm">
                                            <span class="input-group-text bg-light fw-semibold">Lng</span>
                                            <input type="text" class="form-control model" name="Longitud" id="txtLongitud" readonly>
                                        </div>
                                    </div>
                                </div>

                                <!-- Botón de Registro alineado debajo del mapa -->
                                <div class="d-grid mt-4">
                                    <button class="btn btn-primary btn-lg shadow-sm" type="button" id="btnGuardarRegistro">
                                        <i class="ti ti-user-check me-1"></i>Crear Cuenta
                                    </button>
                                </div>

                                <div class="text-center mt-3">
                                    <p class="text-muted fs-14 mb-0">¿Ya tienes una cuenta? <a href="Default.aspx" class="fw-semibold text-primary ms-1">¡Inicia Sesión!</a></p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <!-- Vendor js -->
    <script src="assets/js/vendor.min.js"></script>
    <!-- App js -->
    <script src="assets/js/app.js"></script>
    <script src="assets/vendor/sweetalert2/sweetalert2.min.js"></script>
    <script src="assets/vendor/loadingoverlay/loadingoverlay.min.js"></script>
    <script src="js/RegistroPage.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
    <!-- Google Maps API (AQUÍ DEBES PONER TU KEY) -->
    <script src="https://maps.googleapis.com/maps/api/js?key=xxxxxxxxxx&loading=async&callback=initMap"></script>

    <!-- Script de lógica de la página -->
</body>
</html>
