using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion.MasterCliente
{
    public partial class HomeCliente : System.Web.UI.MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Response.AppendHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");

            // 1. AUTENTICACIÓN
            if (Session["UsuarioLogueado"] == null || Session["TipoUsuario"] == null)
            {
                Response.Redirect("~/Default.aspx");
                return;
            }

            // 2. AUTORIZACIÓN: Solo Clientes
            if (Session["TipoUsuario"].ToString() != "Cliente")
            {
                // Si un Admin o Repartidor intenta entrar a la vista de clientes
                Session.Clear();
                Session.Abandon();
                Response.Redirect("~/Default.aspx");
                return;
            }
        }
    }
}