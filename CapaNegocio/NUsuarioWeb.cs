using CapaDatos;
using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NUsuarioWeb
    {
        #region "PATRON SINGLETON"
        private static NUsuarioWeb instancia = null;
        private NUsuarioWeb() { }
        public static NUsuarioWeb GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NUsuarioWeb();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditUsuariosWeb(EUsuarioWeb objeto)
        {
            return DUsuarioWeb.GetInstance().GuardarOrEditUsuariosWeb(objeto);
        }

        public Respuesta<List<EUsuarioWeb>> ListaUsuarios()
        {
            return DUsuarioWeb.GetInstance().ListaUsuarios();
        }

        public Respuesta<List<EUsuarioWeb>> ListaRepartidores()
        {
            var response = DUsuarioWeb.GetInstance().ListaUsuarios();

            if (response.Estado && response.Data != null)
            {
                // Filtramos solo los repartidores (IdRol = 2) y que estén activos
                var listaRepartidores = response.Data.Where(x => x.IdRol == 2 && x.Estado == true).ToList();

                return new Respuesta<List<EUsuarioWeb>>()
                {
                    Estado = true,
                    Data = listaRepartidores,
                    Mensaje = "Lista obtenida correctamente"
                };
            }

            return response; // Si hubo error, retornamos el error original
        }

        public Respuesta<List<ERoles>> ListaRoles()
        {
            return DUsuarioWeb.GetInstance().ListaRoles();
        }

        public Respuesta<DtoUsuarioSesion> LoginUnificado(string correo)
        {
            return DUsuarioWeb.GetInstance().LoginUnificado(correo);
        }
    }
}
