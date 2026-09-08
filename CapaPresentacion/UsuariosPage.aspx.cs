using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class UsuariosPage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<ERoles>> ListaRoles()
        {
            return NUsuarioWeb.GetInstance().ListaRoles();
        }

        [WebMethod]
        public static Respuesta<List<EUsuarioWeb>> ListaUsuarios()
        {
            return NUsuarioWeb.GetInstance().ListaUsuarios();
        }

        [WebMethod]
        public static Respuesta<int> GuardarOrEditUsuarios(EUsuarioWeb objeto)
        {
            try
            {

                // 2. Manejo de la clave
                if (objeto.IdUsuarioWeb == 0)
                {
                    objeto.ClaveHash = Utilidades.GetInstance().Hash(objeto.NroCI);
                }
                else
                {
                    objeto.ClaveHash = "";
                }
                return NUsuarioWeb.GetInstance().GuardarOrEditUsuariosWeb(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }
    }
}