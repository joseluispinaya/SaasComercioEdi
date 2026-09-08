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
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Response.AppendHeader("Cache-Control", "no-store");
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<DtoUsuarioSesion> InicioSesion(string Correo, string Clave)
        {
            try
            {
                var resp = NUsuarioWeb.GetInstance().LoginUnificado(Correo);

                if (!resp.Estado || resp.Data == null)
                {
                    return new Respuesta<DtoUsuarioSesion> { Estado = false, Mensaje = resp.Mensaje };
                }

                var objUser = resp.Data;

                // Validar Estado
                if (!objUser.Estado)
                {
                    return new Respuesta<DtoUsuarioSesion> { Estado = false, Mensaje = "Su cuenta se encuentra inactiva." };
                }

                // Verificamos la contraseña (BCrypt)
                bool passCorrecta = Utilidades.GetInstance().Verify(Clave, objUser.ClaveHash);

                if (!passCorrecta)
                {
                    return new Respuesta<DtoUsuarioSesion> { Estado = false, Mensaje = "Usuario o Contraseña incorrectos." };
                }

                // Seguridad: Limpiamos la clave antes de guardarla en sesión
                objUser.ClaveHash = "";

                // Guardamos en sesión el objeto limpio
                HttpContext.Current.Session["UsuarioLogueado"] = objUser;

                string rutaUrl;

                if (objUser.IdRol == 3)
                {
                    rutaUrl = "MasterCliente/InicioCliente.aspx";
                    HttpContext.Current.Session["TipoUsuario"] = "Cliente";
                }
                else
                {
                    rutaUrl = "Inicio.aspx";
                    HttpContext.Current.Session["TipoUsuario"] = "Administracion";
                }

                return new Respuesta<DtoUsuarioSesion>
                {
                    Estado = true,
                    Data = objUser,
                    Valor = rutaUrl, // Mandamos la ruta al JS
                    Mensaje = "Bienvenido al sistema"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<DtoUsuarioSesion> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }
    }
}