using CapaEntidad.DTOs;
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
    public partial class ListaPedidos : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<DtoPedidoAdmin>> ListarPedidosAdmin(int estadoPedido)
        {
            return NPedido.GetInstance().ListarPedidosAdmin(estadoPedido);
        }

        [WebMethod]
        public static Respuesta<List<DtoDetallePedidoAdmin>> ObtenerDetalle(int idPedido)
        {
            return NPedido.GetInstance().ObtenerDetallePedido(idPedido);
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> ActualizarEstado(int idPedido, int estadoPedido)
        {
            // 1. Validar sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                // 2. Extraer el Id del Repartidor desde la sesión activa
                DtoUsuarioSesion repartidor = (DtoUsuarioSesion)HttpContext.Current.Session["UsuarioLogueado"];
                int idRepartidor = repartidor.IdUsuario;

                // 3. Ejecutar la capa de negocio
                return NPedido.GetInstance().ActualizarEstadoPedido(idPedido, idRepartidor, estadoPedido);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }
    }
}