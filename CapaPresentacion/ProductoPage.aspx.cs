using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class ProductoPage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<ESabor>> ListarSabores() 
            => NProducto.GetInstance().ListarSabores();

        [WebMethod]
        public static Respuesta<List<EPresentacion>> ListarPresentaciones() 
            => NProducto.GetInstance().ListarPresentaciones();

        [WebMethod]
        public static Respuesta<List<EProducto>> ListarProductos() 
            => NProducto.GetInstance().ListarProductos();

        [WebMethod]
        public static Respuesta<DtoProductoCompleto> ObtenerProductoPorId(int idProducto) 
            => NProducto.GetInstance().ObtenerProductoPorId(idProducto);

        [WebMethod]
        public static Respuesta<int> Guardar(EProducto objeto, string base64Image, List<EProductoVariante> listaVariantes)
        {
            try
            {
                string imagenUrl = string.Empty;

                // 1. Procesar la imagen si fue enviada
                if (!string.IsNullOrEmpty(base64Image))
                {
                    byte[] imageBytes = Convert.FromBase64String(base64Image);
                    using (var stream = new MemoryStream(imageBytes))
                    {
                        string folder = "/Imagenes/";
                        // Asumiendo que tu método UploadPhoto/UploadImage está en Utilidades
                        imagenUrl = Utilidades.GetInstance().UploadPhoto(stream, folder);
                    }
                }

                objeto.ImagenUrl = imagenUrl;

                // 2. Construir el TVP (Table-Valued Parameter)
                DataTable dtDatos = new DataTable();
                dtDatos.Columns.Add("IdPresentacion", typeof(int));
                dtDatos.Columns.Add("IdSabor", typeof(int)); // Debe soportar nulos
                dtDatos.Columns.Add("Precio", typeof(decimal));

                foreach (var variante in listaVariantes)
                {
                    object valIdSabor = DBNull.Value;
                    if (variante.IdSabor != 0)
                    {
                        valIdSabor = variante.IdSabor;
                    }
                    dtDatos.Rows.Add(variante.IdPresentacion, valIdSabor, variante.Precio);
                }

                // 3. Ejecutar guardado
                return NProducto.GetInstance().GuardarProducto(objeto, dtDatos);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<int> ActualizarProducto(EProducto objeto, string base64Image)
        {
            try
            {
                string imagenUrl = string.Empty;
                if (!string.IsNullOrEmpty(base64Image))
                {
                    byte[] imageBytes = Convert.FromBase64String(base64Image);
                    using (var stream = new MemoryStream(imageBytes))
                    {
                        imagenUrl = Utilidades.GetInstance().UploadPhoto(stream, "/Imagenes/");
                    }
                }
                objeto.ImagenUrl = imagenUrl;

                return NProducto.GetInstance().ActualizarProducto(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<int> ActualizarVariante(int idVariante, decimal precio, bool estado)
        {
            return NProducto.GetInstance().ActualizarVariante(idVariante, precio, estado);
        }
    }
}