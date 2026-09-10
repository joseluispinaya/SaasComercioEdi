using CapaDatos;
using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NProducto
    {
        #region "PATRON SINGLETON"
        private static NProducto instancia = null;
        private NProducto() { }
        public static NProducto GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NProducto();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<ESabor>> ListarSabores() => DProducto.GetInstance().ListarSabores();
        public Respuesta<List<EPresentacion>> ListarPresentaciones() => DProducto.GetInstance().ListarPresentaciones();
        public Respuesta<List<EProducto>> ListarProductos() => DProducto.GetInstance().ListarProductos();

        public Respuesta<int> GuardarProducto(EProducto objeto, DataTable dtDetalles)
            => DProducto.GetInstance().GuardarProducto(objeto, dtDetalles);

        public Respuesta<int> ActualizarProducto(EProducto objeto)
            => DProducto.GetInstance().ActualizarProducto(objeto);

        public Respuesta<int> ActualizarVariante(int idVariante, decimal precio, bool estado)
            => DProducto.GetInstance().ActualizarVariante(idVariante, precio, estado);

        public Respuesta<DtoProductoCompleto> ObtenerProductoPorId(int idProducto)
            => DProducto.GetInstance().ObtenerProductoPorId(idProducto);

        // Agrega esto dentro de tu clase NProducto
        public Respuesta<List<DtoCatalogoProducto>> ListarCatalogoActivo()
        {
            return DProducto.GetInstance().ListarCatalogoActivo();
        }
    }
}
