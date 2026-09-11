namespace CapaEntidad.DTOs
{
    public class DtoPedidoAdmin
    {
        public int IdPedido { get; set; }
        public string NombreCliente { get; set; }
        public string FechaHoraLocal { get; set; }
        public decimal TotalPedido { get; set; }
        public int EstadoPedido { get; set; }
        public decimal Latitud { get; set; }   // Nueva propiedad
        public decimal Longitud { get; set; }  // Nueva propiedad
    }
}
