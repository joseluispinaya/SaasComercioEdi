<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="CapaPresentacion.Default" %>

<!DOCTYPE html>

<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tienda Eddy - La mejor coca machucada</title>
    
    <link href="assets/vendor/sweetalert2/sweetalert2.min.css" rel="stylesheet" type="text/css" />
    <!-- Google Fonts: Poppins para un diseño moderno -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <!-- Bootstrap 5 CSS (CDN) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    
    <!-- FontAwesome 6 (CDN) para iconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f8f9fa;
        }
        
        /* Navbar personalizado */
        .navbar-custom {
            background-color: #1a1d20;
            padding: 15px 0;
        }
        .navbar-custom .navbar-brand {
            font-weight: 700;
            color: #28a745; /* Verde llamativo */
            font-size: 1.5rem;
        }
        
        /* Hero Section (Imagen de fondo principal) */
        /* SUGERENCIA DE IMAGEN: Tamaño recomendado 1920x1080 px (Fondo oscuro o de hojas de coca) */
        .hero-section {
            background: linear-gradient(rgba(26, 29, 32, 0.8), rgba(26, 29, 32, 0.8)), url('image/fondo.jpg') center/cover no-repeat;
            color: white;
            padding: 150px 0 100px 0;
            text-align: center;
            min-height: 80vh;
            display: flex;
            align-items: center;
        }
        .hero-section h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 20px;
        }
        .hero-section p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            color: #d1d5db;
        }

        /* Estilo de las tarjetas de productos */
        .product-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: none;
            border-radius: 15px;
            overflow: hidden;
        }
        .product-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }
        .product-card img {
            /* SUGERENCIA DE IMAGEN: Tamaño recomendado 800x600 px (Formato horizontal o cuadrado) */
            height: 250px;
            object-fit: cover;
        }
        
        .bg-green-custom {
            background-color: #28a745;
            color: white;
        }
        
        .footer {
            background-color: #1a1d20;
            color: #adb5bd;
            padding: 30px 0;
        }
    </style>
</head>
<body>

    <!-- ============================================== -->
    <!-- NAVBAR -->
    <!-- ============================================== -->
    <nav class="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="#"><i class="fa-solid fa-leaf me-2"></i>Tienda Eddy</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item me-3 mb-2 mb-lg-0">
                        <!-- Botón de Inicio de Sesión -->
                        <a href="javascript:void(0);" id="btnAbrirLogin" class="nav-link fw-semibold text-white">
                            <i class="fa-solid fa-right-to-bracket me-1"></i> Iniciar Sesión
                        </a>
                    </li>
                    <li class="nav-item">
                        <!-- Botón de Registro -->
                        <a href="javascript:void(0);" id="btnAbrirRegistro" class="btn btn-success rounded-pill px-4 fw-semibold shadow-sm">
                            <i class="fa-solid fa-user-plus me-1"></i> Registrarse
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- ============================================== -->
    <!-- HERO SECTION -->
    <!-- ============================================== -->
    <section class="hero-section">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <h1>Tu pedido directo, <span class="text-success">sin confusiones</span></h1>
                    <p>Disfruta de la mejor coca machucada en sus diferentes tamaños y sabores, cigarrillos, tabaco y más. Olvídate de los chats perdidos, regístrate y realiza tu pedido al instante.</p>
                    <a href="#productos" class="btn btn-success btn-lg rounded-pill px-5 py-3 shadow">
                        Ver Productos <i class="fa-solid fa-arrow-down ms-2"></i>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================== -->
    <!-- SECCIÓN DE PRODUCTOS -->
    <!-- ============================================== -->
    <section id="productos" class="py-5">
        <div class="container py-4">
            <div class="text-center mb-5">
                <h2 class="fw-bold">Lo que Ofrecemos</h2>
                <p class="text-muted">Variedad, calidad y entrega rápida.</p>
            </div>

            <div class="row g-4">
                <!-- Tarjeta 1 -->
                <div class="col-md-4">
                    <div class="card product-card shadow-sm h-100">
                        <!-- Reemplazar src con ruta de imagen 800x600 px -->
                        <img src="image/productt.jpg" class="card-img-top" alt="Coca Machucada">
                        <div class="card-body text-center p-4">
                            <h4 class="card-title fw-bold">Coca Machucada</h4>
                            <p class="card-text text-muted">Fresca y lista. Por cuartilla, mediana o pequeña.</p>
                            <div class="d-flex justify-content-center flex-wrap gap-2 mb-3">
                                <span class="badge bg-green-custom">Chicle</span>
                                <span class="badge bg-green-custom">Banana</span>
                                <span class="badge bg-green-custom">Café</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tarjeta 2 -->
                <div class="col-md-4">
                    <div class="card product-card shadow-sm h-100">
                        <!-- Reemplazar src con ruta de imagen 800x600 px -->
                        <img src="image/productt.jpg" class="card-img-top" alt="Cigarrillos y Tabaco">
                        <div class="card-body text-center p-4">
                            <h4 class="card-title fw-bold">Cigarrillos & Tabaco</h4>
                            <p class="card-text text-muted">Venta por paquete de tus marcas favoritas.</p>
                        </div>
                    </div>
                </div>

                <!-- Tarjeta 3 -->
                <div class="col-md-4">
                    <div class="card product-card shadow-sm h-100">
                        <!-- Reemplazar src con ruta de imagen 800x600 px -->
                            <img src="image/productt.jpg" class="card-img-top" alt="Vico">
                            <div class="card-body text-center p-4">
                            <h4 class="card-title fw-bold">Vico</h4>
                            <p class="card-text text-muted">Disponible por docena. El complemento perfecto.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================== -->
    <!-- CÓMO FUNCIONA / VENTAJAS -->
    <!-- ============================================== -->
    <section class="bg-white py-5 border-top">
        <div class="container py-4">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-4 mb-lg-0">
                    <h2 class="fw-bold mb-3">¿Por qué usar nuestro sistema?</h2>
                    <p class="text-muted mb-4">Dejamos atrás las complicaciones del WhatsApp. Ahora tienes el control total de lo que pides.</p>
                    
                    <ul class="list-unstyled">
                        <li class="mb-3"><i class="fa-solid fa-circle-check text-success me-2 fs-5"></i> Cero confusiones con tus pedidos.</li>
                        <li class="mb-3"><i class="fa-solid fa-circle-check text-success me-2 fs-5"></i> Selecciona exactamente tu tamaño y sabor.</li>
                        <li class="mb-3"><i class="fa-solid fa-circle-check text-success me-2 fs-5"></i> Rastrea el estado de entrega en tiempo real.</li>
                    </ul>
                </div>
                <div class="col-lg-6 text-center">
                    <!-- SUGERENCIA DE IMAGEN: Tamaño recomendado 600x600 px (Imagen tipo ilustración o mockup de la web) -->
                    <img src="image/delivery_mockup.jpg" alt="Delivery App" class="img-fluid rounded" style="max-height: 400px;">
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================== -->
    <!-- FOOTER -->
    <!-- ============================================== -->
    <footer class="footer text-center">
        <div class="container">
            <p class="mb-0">&copy; 2026 Tienda Eddy. Todos los derechos reservados.</p>
            <p class="small text-muted mt-1">Desarrollado para brindarte el mejor servicio.</p>
        </div>
    </footer>

    <div class="modal fade" id="modalLogin" tabindex="-1" aria-labelledby="modalLoginLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 15px;">

                <div class="modal-header bg-dark text-white" style="border-top-left-radius: 15px; border-top-right-radius: 15px;">
                    <h5 class="modal-title fw-bold" id="modalLoginLabel">
                        <i class="fa-solid fa-right-to-bracket me-2 text-success"></i>Iniciar Sesión
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body p-4">
                    <div class="text-center mb-4">
                        <h4 class="fw-bold">¡Bienvenido!</h4>
                        <p class="text-muted fs-14">Ingresa tus credenciales para acceder a tu cuenta.</p>
                    </div>

                    <form id="frmLogin">
                        <div class="mb-3">
                            <label for="txtCorreoLogin" class="form-label fw-semibold text-muted mb-1">Correo Electrónico</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0"><i class="fa-solid fa-envelope text-muted"></i></span>
                                <input type="email" class="form-control border-start-0" id="txtCorreoLogin" placeholder="tucorreo@ejemplo.com">
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="txtClaveLogin" class="form-label fw-semibold text-muted mb-1">Contraseña</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0"><i class="fa-solid fa-lock text-muted"></i></span>
                                <input type="password" class="form-control border-start-0 border-end-0" id="txtClaveLogin" placeholder="Tu contraseña">
                                <button class="btn btn-outline-secondary border-start-0" type="button" id="btnToggleClaveLogin">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                            </div>
                        </div>

                        <div class="d-grid mb-3">
                            <button type="button" id="btnIngresar" class="btn btn-success rounded-pill shadow-sm fw-bold">
                                Ingresar
                            </button>
                        </div>
                    </form>

                    <div class="text-center mt-3">
                        <p class="text-muted fs-14 mb-0">
                            ¿No tienes una cuenta? <a href="RegistroPage.aspx" class="fw-semibold text-success text-decoration-none">Regístrate aquí</a>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- jQuery CDN -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <!-- Bootstrap 5 Bundle JS (CDN) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <script src="assets/vendor/sweetalert2/sweetalert2.min.js"></script>
    <script src="assets/vendor/loadingoverlay/loadingoverlay.min.js"></script>
    <script src="js/Default.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>

</body>
</html>
