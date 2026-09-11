namespace CapaEntidad.DTOs
{
    public class DtoDetallePedido
    {
        public int IdVariante { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal SubTotal { get; set; }
    }
}
