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

            if (Session["UsuarioLogueado"] == null || Session["TipoUsuario"] == null)
            {
                Response.Redirect("~/Default.aspx");
                return;
            }

            if (Session["TipoUsuario"].ToString() != "Cliente")
            {
                Session.Clear();
                Session.Abandon();
                Response.Redirect("~/Default.aspx");
                return;
            }
        }
    }
}