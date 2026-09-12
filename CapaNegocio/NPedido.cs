using CapaDatos;
using CapaEntidad.DTOs;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NPedido
    {
        #region "PATRON SINGLETON"
        private static NPedido instancia = null;
        private NPedido() { }
        public static NPedido GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NPedido();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarPedido(int idCliente, decimal totalPedido, DataTable dtDetalles)
        {
            return DPedido.GetInstance().GuardarPedido(idCliente, totalPedido, dtDetalles);
        }

        public Respuesta<List<DtoPedidoAdmin>> ListarPedidosAdmin(int estadoPedido)
        {
            return DPedido.GetInstance().ListarPedidosAdmin(estadoPedido);
        }

        public Respuesta<List<DtoPedidoAdmin>> ListarPedidosEntregados(int idRepartidor, DateTime fechaConsulta)
        {
            return DPedido.GetInstance().ListarPedidosEntregados(idRepartidor, fechaConsulta);
        }

        public Respuesta<List<DtoDetallePedidoAdmin>> ObtenerDetallePedido(int idPedido)
        {
            return DPedido.GetInstance().ObtenerDetallePedido(idPedido);
        }

        public Respuesta<int> ActualizarEstadoPedido(int idPedido, int idRepartidor, int estadoPedido)
        {
            return DPedido.GetInstance().ActualizarEstadoPedido(idPedido, idRepartidor, estadoPedido);
        }

    }
}
