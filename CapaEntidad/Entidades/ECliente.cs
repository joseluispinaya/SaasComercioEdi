namespace CapaEntidad.Entidades
{
    public class ECliente
    {
        public int IdCliente { get; set; }
        public string NombreCompleto { get; set; }
        public string NroCI { get; set; }
        public string Correo { get; set; }
        public string NroContacto { get; set; }
        public string ClaveHash { get; set; }
        public string UbicacionNegocio { get; set; }
        public decimal Latitud { get; set; }
        public decimal Longitud { get; set; }
        public bool Estado { get; set; }
    }
}
