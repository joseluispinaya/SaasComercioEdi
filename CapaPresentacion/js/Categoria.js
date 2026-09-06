
let tablaData;
let idEditar = 0;

// ==========================================
// EVENTO: ABRIR MODAL PARA NUEVO REGISTRO
// ==========================================
$("#btnNuevoRegistro").on("click", function () {
    idEditar = 0;

    // Limpiamos los campos
    $("#txtNombreCategoria").val("");
    $("#chkEstado").prop("checked", true); // Por defecto activo al crear

    $("#modalLabelCategoria").text("Nuevo Registro");
    $("#modalCategoria").modal("show");
});

// ==========================================