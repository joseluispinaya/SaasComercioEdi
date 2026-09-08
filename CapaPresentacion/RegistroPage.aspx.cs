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
    public partial class RegistroPage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<int> GuardarClientes(ECliente objeto)
        {
            try
            {
                // Como es exclusivamente registro nuevo, forzamos Id = 0
                objeto.IdCliente = 0;

                // Encriptamos la clave usando tu clase de Utilidades (BCrypt)
                objeto.ClaveHash = Utilidades.GetInstance().Hash(objeto.ClaveHash);

                // Estado por defecto Activo al crear cuenta
                objeto.Estado = true;

                return NCliente.GetInstance().GuardarOrEditClientes(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int>
                {
                    Estado = false,
                    Valor = "error",
                    Mensaje = "Error en el servidor: " + ex.Message
                };
            }
        }
    }
}