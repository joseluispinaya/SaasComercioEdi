using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class ControlEntregas : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<EUsuarioWeb>> ListaRepartidores()
        {
            return NUsuarioWeb.GetInstance().ListaRepartidores();
        }

        [WebMethod]
        public static Respuesta<List<DtoPedidoAdmin>> BuscarEntregas(int idRepartidor, string fecha)
        {
            try
            {
                // 1. Validar y convertir Fecha de forma segura
                if (!DateTime.TryParseExact(fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaFiltro))
                {
                    return new Respuesta<List<DtoPedidoAdmin>> { Estado = false, Mensaje = "El formato de la fecha no es válido. Debe ser dd/MM/yyyy." };
                }

                return NPedido.GetInstance().ListarPedidosEntregados(idRepartidor, fechaFiltro);
            }
            catch (Exception ex)
            {
                return new Respuesta<List<DtoPedidoAdmin>> { Estado = false, Mensaje = "Error en el servidor: " + ex.Message };
            }
        }
    }
}