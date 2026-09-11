namespace CapaEntidad.DTOs
{
    public class DtoDetallePedidoAdmin
    {
        public string NombreProducto { get; set; }
        public string NombrePresentacion { get; set; }
        public string NombreSabor { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal SubTotal { get; set; }
    }
}
