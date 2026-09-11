using CapaEntidad.DTOs;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class DPedido
    {
        #region "PATRON SINGLETON"
        private static DPedido instancia = null;
        private DPedido() { }
        public static DPedido GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DPedido();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarPedido(int idCliente, decimal totalPedido, DataTable dtDetalles)
        {
            Respuesta<int> response = new Respuesta<int>();

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarPedido", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdCliente", idCliente);
                        cmd.Parameters.AddWithValue("@TotalPedido", totalPedido);

                        // Parámetro TVP
                        SqlParameter tvpParam = new SqlParameter("@Detalles", SqlDbType.Structured)
                        {
                            TypeName = "dbo.typ_DetallePedido",
                            Value = dtDetalles
                        };
                        cmd.Parameters.Add(tvpParam);

                        SqlParameter outputParam = new SqlParameter("@Resultado", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputParam);

                        con.Open();
                        cmd.ExecuteNonQuery();

                        int resultado = Convert.ToInt32(outputParam.Value);
                        response.Data = resultado;

                        if (resultado == 1)
                        {
                            response.Estado = true;
                            response.Valor = "success";
                            response.Mensaje = "¡Pedido registrado exitosamente!";
                        }
                        else
                        {
                            response.Estado = false;
                            response.Valor = "error";
                            response.Mensaje = "No se pudo procesar el pedido. Intente nuevamente.";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Valor = "error";
                response.Mensaje = "Error interno: " + ex.Message;
            }

            return response;
        }

        public Respuesta<List<DtoPedidoAdmin>> ListarPedidosAdmin(int estadoPedido)
        {
            List<DtoPedidoAdmin> lista = new List<DtoPedidoAdmin>();
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ListarPedidos", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@EstadoPedido", estadoPedido);
                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                lista.Add(new DtoPedidoAdmin
                                {
                                    IdPedido = Convert.ToInt32(dr["IdPedido"]),
                                    NombreCliente = dr["NombreCliente"].ToString(),
                                    FechaHoraLocal = dr["FechaHoraLocal"].ToString(),
                                    TotalPedido = Convert.ToDecimal(dr["TotalPedido"]),
                                    EstadoPedido = Convert.ToInt32(dr["EstadoPedido"]),
                                    // Si permites nulos en BD, usa validación. Si no, directo:
                                    Latitud = dr["Latitud"] != DBNull.Value ? Convert.ToDecimal(dr["Latitud"]) : 0,
                                    Longitud = dr["Longitud"] != DBNull.Value ? Convert.ToDecimal(dr["Longitud"]) : 0
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<DtoPedidoAdmin>> { Estado = true, Data = lista };
            }
            catch (Exception ex) { return new Respuesta<List<DtoPedidoAdmin>> { Estado = false, Mensaje = ex.Message }; }
        }

        public Respuesta<List<DtoDetallePedidoAdmin>> ObtenerDetallePedido(int idPedido)
        {
            List<DtoDetallePedidoAdmin> lista = new List<DtoDetallePedidoAdmin>();
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ObtenerDetallePedido", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdPedido", idPedido);
                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                lista.Add(new DtoDetallePedidoAdmin
                                {
                                    NombreProducto = dr["NombreProducto"].ToString(),
                                    NombrePresentacion = dr["NombrePresentacion"].ToString(),
                                    NombreSabor = dr["NombreSabor"].ToString(),
                                    Cantidad = Convert.ToInt32(dr["Cantidad"]),
                                    PrecioUnitario = Convert.ToDecimal(dr["PrecioUnitario"]),
                                    SubTotal = Convert.ToDecimal(dr["SubTotal"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<DtoDetallePedidoAdmin>> { Estado = true, Data = lista };
            }
            catch (Exception ex) { return new Respuesta<List<DtoDetallePedidoAdmin>> { Estado = false, Mensaje = ex.Message }; }
        }

        public Respuesta<int> ActualizarEstadoPedido(int idPedido, int idRepartidor, int estadoPedido)
        {
            Respuesta<int> response = new Respuesta<int>();
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ActualizarEstadoPedido", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdPedido", idPedido);

                        // Si no seleccionan repartidor (mandan 0), enviamos NULL
                        if (idRepartidor == 0)
                            cmd.Parameters.AddWithValue("@IdRepartidor", DBNull.Value);
                        else
                            cmd.Parameters.AddWithValue("@IdRepartidor", idRepartidor);

                        cmd.Parameters.AddWithValue("@EstadoPedido", estadoPedido);

                        SqlParameter outParam = new SqlParameter("@Resultado", SqlDbType.Int) { Direction = ParameterDirection.Output };
                        cmd.Parameters.Add(outParam);

                        con.Open();
                        cmd.ExecuteNonQuery();

                        int result = Convert.ToInt32(outParam.Value);

                        if (result == 1)
                        {
                            response.Estado = true; response.Mensaje = "Estado y repartidor actualizados."; response.Valor = "success";
                        }
                        else if (result == 2)
                        {
                            response.Estado = false; response.Mensaje = "El pedido no existe."; response.Valor = "warning";
                        }
                        else
                        {
                            response.Estado = false; response.Mensaje = "Error interno al actualizar."; response.Valor = "error";
                        }
                    }
                }
            }
            catch (Exception ex) { response.Estado = false; response.Mensaje = ex.Message; response.Valor = "error"; }

            return response;
        }

    }
}
