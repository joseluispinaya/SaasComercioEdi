namespace CapaEntidad.Entidades
{
    public class EUsuarioWeb
    {
        public int IdUsuarioWeb { get; set; }
        public int IdRol { get; set; }
        public string NombreRol { get; set; } // Campo extraído del INNER JOIN para la tabla
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string NroCI { get; set; }
        public string Correo { get; set; }
        public string NroContacto { get; set; }
        public string ClaveHash { get; set; }
        public bool Estado { get; set; }
    }
}
