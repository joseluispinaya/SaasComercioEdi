using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CapaPresentacion
{
    public class Utilidades
    {
        #region "PATRON SINGLETON"
        private static Utilidades _instancia = null;

        private Utilidades()
        {

        }

        public static Utilidades GetInstance()
        {
            if (_instancia == null)
            {
                _instancia = new Utilidades();
            }
            return _instancia;
        }
        #endregion

        public string Hash(string password)
        {
            // Validamos que no nos envíen contraseñas vacías
            if (string.IsNullOrEmpty(password))
                return string.Empty;

            // Encripta la contraseña. BCrypt genera y aplica el "Salt" automáticamente
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool Verify(string password, string hash)
        {
            // Validamos que ninguno de los dos sea nulo o vacío
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hash))
                return false;

            // Verifica si la contraseña en texto plano coincide con el hash de la BD
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}