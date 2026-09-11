using CapaEntidad.DTOs;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion.MasterCliente
{
    public partial class PedidoPage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> GuardarPedido(decimal totalPedido, List<DtoDetallePedido> detalles)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "Su sesión ha expirado. Inicie sesión nuevamente." };
            }

            if (detalles == null || detalles.Count == 0)
            {
                return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "No hay productos en el pedido para guardar." };
            }

            try
            {
                // Obtenemos el usuario logueado (Cliente)
                DtoUsuarioSesion usuario = (DtoUsuarioSesion)HttpContext.Current.Session["UsuarioLogueado"];

                // 1. Armar el DataTable con la estructura del TYPE en SQL
                DataTable dtDetalles = new DataTable();
                dtDetalles.Columns.Add("IdVariante", typeof(int));
                dtDetalles.Columns.Add("Cantidad", typeof(int));
                dtDetalles.Columns.Add("PrecioUnitario", typeof(decimal));
                dtDetalles.Columns.Add("SubTotal", typeof(decimal));

                // 2. Llenar el DataTable iterando la lista
                foreach (var item in detalles)
                {
                    dtDetalles.Rows.Add(
                        item.IdVariante,
                        item.Cantidad,
                        item.PrecioUnitario,
                        item.SubTotal
                    );
                }

                // 3. Enviar a Capa Negocio
                return NPedido.GetInstance().GuardarPedido(usuario.IdUsuario, totalPedido, dtDetalles);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }
    }
}