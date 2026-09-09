using System.Collections.Generic;

namespace CapaEntidad.Entidades
{
    public class EProducto
    {
        public int IdProducto { get; set; }
        public int IdCategoria { get; set; }
        public string NombreCategoria { get; set; }
        public string NombreProducto { get; set; }
        public string ImagenUrl { get; set; }
        public bool Estado { get; set; }
        public int NroVariantes { get; set; }
    }

    public class EProductoVariante
    {
        public int IdVariante { get; set; }
        public int IdPresentacion { get; set; }
        public string NombrePresentacion { get; set; }
        public int IdSabor { get; set; }
        public string NombreSabor { get; set; }
        public decimal Precio { get; set; }
        public bool Estado { get; set; }
    }

    // Clase compuesta para la lectura completa (Maestro - Detalle)
    public class DtoProductoCompleto
    {
        public EProducto Producto { get; set; }
        public List<EProductoVariante> Variantes { get; set; }
    }
}
