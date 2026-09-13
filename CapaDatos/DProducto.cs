using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
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
    public class DProducto
    {
        #region "PATRON SINGLETON"
        private static DProducto instancia = null;
        private DProducto() { }
        public static DProducto GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DProducto();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<ESabor>> ListarSabores()
        {
            List<ESabor> lista = new List<ESabor>();
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ListarSabores", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                lista.Add(new ESabor
                                {
                                    IdSabor = Convert.ToInt32(dr["IdSabor"]),
                                    NombreSabor = dr["NombreSabor"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ESabor>> { Estado = true, Data = lista };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ESabor>> { Estado = false, Mensaje = ex.Message };
            }
        }

        public Respuesta<List<EPresentacion>> ListarPresentaciones()
        {
            List<EPresentacion> lista = new List<EPresentacion>();
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ListarPresentaciones", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                lista.Add(new EPresentacion
                                {
                                    IdPresentacion = Convert.ToInt32(dr["IdPresentacion"]),
                                    NombrePresentacion = dr["NombrePresentacion"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EPresentacion>> { Estado = true, Data = lista };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EPresentacion>> { Estado = false, Mensaje = ex.Message };
            }
        }

        public Respuesta<List<EProducto>> ListarProductos()
        {
            List<EProducto> lista = new List<EProducto>();
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ListarProductos", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                lista.Add(new EProducto
                                {
                                    IdProducto = Convert.ToInt32(dr["IdProducto"]),
                                    NombreProducto = dr["NombreProducto"].ToString(),
                                    ImagenUrl = dr["ImagenUrl"].ToString(),
                                    NombreCategoria = dr["NombreCategoria"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"]),
                                    NroVariantes = Convert.ToInt32(dr["NroVariantes"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EProducto>> { Estado = true, Data = lista };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EProducto>> { Estado = false, Mensaje = ex.Message };
            }
        }

        public Respuesta<int> GuardarProducto(EProducto objeto, DataTable dtDetalles)
        {
            Respuesta<int> response = new Respuesta<int>();
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_RegistrarProducto", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdCategoria", objeto.IdCategoria);
                        cmd.Parameters.AddWithValue("@NombreProducto", objeto.NombreProducto);
                        cmd.Parameters.AddWithValue("@ImagenUrl", string.IsNullOrEmpty(objeto.ImagenUrl) ? "" : objeto.ImagenUrl);

                        SqlParameter tvpParam = new SqlParameter("@Variantes", SqlDbType.Structured)
                        {
                            TypeName = "dbo.typ_ProductoVariante",
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

                        int resultadoCodigo = Convert.ToInt32(outputParam.Value);
                        response.Data = resultadoCodigo;

                        if (resultadoCodigo == 1)
                        {
                            response.Estado = true; response.Valor = "success"; response.Mensaje = "Producto registrado correctamente.";
                        }
                        else if (resultadoCodigo == 2)
                        {
                            response.Estado = false; response.Valor = "warning"; response.Mensaje = "Ya existe un producto con el mismo nombre en esta categoría.";
                        }
                        else
                        {
                            response.Estado = false; response.Valor = "error"; response.Mensaje = "Ocurrió un error al intentar guardar el producto.";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.Estado = false; response.Valor = "error"; response.Mensaje = ex.Message;
            }
            return response;
        }

        public Respuesta<int> ActualizarProducto(EProducto objeto)
        {
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ActualizarProducto", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdProducto", objeto.IdProducto);
                        cmd.Parameters.AddWithValue("@IdCategoria", objeto.IdCategoria);
                        cmd.Parameters.AddWithValue("@NombreProducto", objeto.NombreProducto);

                        // Si viene nulo o vacío, el SP preserva el original
                        cmd.Parameters.AddWithValue("@ImagenUrl", string.IsNullOrEmpty(objeto.ImagenUrl) ? (object)DBNull.Value : objeto.ImagenUrl);
                        cmd.Parameters.AddWithValue("@Estado", objeto.Estado);

                        SqlParameter outputParam = new SqlParameter("@Resultado", SqlDbType.Int) { Direction = ParameterDirection.Output };
                        cmd.Parameters.Add(outputParam);

                        con.Open();
                        cmd.ExecuteNonQuery();

                        return new Respuesta<int> { Estado = Convert.ToInt32(outputParam.Value) == 1, Data = 1, Mensaje = "Actualizado correctamente." };
                    }
                }
            }
            catch (Exception ex) { return new Respuesta<int> { Estado = false, Mensaje = ex.Message }; }
        }

        public Respuesta<int> ActualizarVariante(int idVariante, decimal precio, bool estado)
        {
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ActualizarVariante", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdVariante", idVariante);
                        cmd.Parameters.AddWithValue("@Precio", precio);
                        cmd.Parameters.AddWithValue("@Estado", estado);

                        SqlParameter outParam = new SqlParameter("@Resultado", SqlDbType.Int) { Direction = ParameterDirection.Output };
                        cmd.Parameters.Add(outParam);

                        con.Open();
                        cmd.ExecuteNonQuery();

                        return new Respuesta<int> { Estado = Convert.ToInt32(outParam.Value) == 1, Mensaje = "Variante actualizada." };
                    }
                }
            }
            catch (Exception ex) { return new Respuesta<int> { Estado = false, Mensaje = ex.Message }; }
        }

        public Respuesta<DtoProductoCompleto> ObtenerProductoPorId(int idProducto)
        {
            DtoProductoCompleto dtoCompleto = new DtoProductoCompleto { Variantes = new List<EProductoVariante>() };

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ObtenerProductoPorId", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdProducto", idProducto);

                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            // 1. Leemos el Producto Cabecera
                            if (dr.Read())
                            {
                                dtoCompleto.Producto = new EProducto
                                {
                                    IdProducto = Convert.ToInt32(dr["IdProducto"]),
                                    IdCategoria = Convert.ToInt32(dr["IdCategoria"]),
                                    NombreProducto = dr["NombreProducto"].ToString(),
                                    ImagenUrl = dr["ImagenUrl"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                };
                            }

                            // 2. Pasamos al siguiente SELECT para el detalle
                            if (dr.NextResult())
                            {
                                while (dr.Read())
                                {
                                    dtoCompleto.Variantes.Add(new EProductoVariante
                                    {
                                        IdVariante = Convert.ToInt32(dr["IdVariante"]),
                                        IdPresentacion = Convert.ToInt32(dr["IdPresentacion"]),
                                        NombrePresentacion = dr["NombrePresentacion"].ToString(),
                                        IdSabor = dr["IdSabor"] != DBNull.Value ? Convert.ToInt32(dr["IdSabor"]) : 0,
                                        NombreSabor = dr["NombreSabor"].ToString(),
                                        Precio = Convert.ToDecimal(dr["Precio"]),
                                        Estado = Convert.ToBoolean(dr["Estado"])
                                    });
                                }
                            }
                        }
                    }
                }
                return new Respuesta<DtoProductoCompleto> { Estado = dtoCompleto.Producto != null, Data = dtoCompleto };
            }
            catch (Exception ex) { return new Respuesta<DtoProductoCompleto> { Estado = false, Mensaje = ex.Message }; }
        }

        // Agrega esto dentro de tu clase DProducto
        public Respuesta<List<DtoCatalogoProducto>> ListarCatalogoActivo()
        {
            try
            {
                List<DtoCatalogoProducto> rptLista = new List<DtoCatalogoProducto>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListarCatalogoActivo", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.HasRows)
                            {
                                while (dr.Read())
                                {
                                    rptLista.Add(new DtoCatalogoProducto
                                    {
                                        IdVariante = Convert.ToInt32(dr["IdVariante"]),
                                        NombreProducto = dr["NombreProducto"].ToString(),
                                        ImagenUrl = dr["ImagenUrl"].ToString(),
                                        IdCategoria = Convert.ToInt32(dr["IdCategoria"]),
                                        NombreCategoria = dr["NombreCategoria"].ToString(),
                                        NombrePresentacion = dr["NombrePresentacion"].ToString(),
                                        NombreSabor = dr["NombreSabor"].ToString(),
                                        Precio = Convert.ToDecimal(dr["Precio"])
                                    });
                                }
                            }
                        }
                    }
                }

                return new Respuesta<List<DtoCatalogoProducto>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Catálogo obtenido correctamente."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<DtoCatalogoProducto>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener el catálogo: {ex.Message}"
                };
            }
        }

    }
}
