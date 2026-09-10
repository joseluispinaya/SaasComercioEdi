namespace CapaEntidad.DTOs
{
    public class DtoCatalogoProducto
    {
        public int IdVariante { get; set; }
        public string NombreProducto { get; set; }
        public string ImagenUrl { get; set; }
        public string NombreCategoria { get; set; }
        public string NombrePresentacion { get; set; }
        public string NombreSabor { get; set; }
        public decimal Precio { get; set; }
    }
}
