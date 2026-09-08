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
    public class DCategoria
    {
        #region "PATRON SINGLETON"
        private static DCategoria instancia = null;
        private DCategoria() { }
        public static DCategoria GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DCategoria();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditCategorias(ECategoria objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditCategorias", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdCategoria", objeto.IdCategoria);
                        cmd.Parameters.AddWithValue("@NombreCategoria", objeto.NombreCategoria);
                        cmd.Parameters.AddWithValue("@Estado", objeto.Estado);

                        SqlParameter outputParam = new SqlParameter("@Resultado", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputParam);

                        con.Open();
                        cmd.ExecuteNonQuery();

                        resultadoCodigo = Convert.ToInt32(outputParam.Value);
                    }
                }

                response.Data = resultadoCodigo;

                switch (resultadoCodigo)
                {
                    case 1: // Duplicado
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Ya existe una categoría con este nombre.";
                        break;
                    case 2: // Registro Nuevo
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Categoría registrada correctamente.";
                        break;
                    case 3: // Actualización
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Categoría actualizada correctamente.";
                        break;
                    case 0: // Error
                    default:
                        response.Estado = false;
                        response.Valor = "error";
                        response.Mensaje = "No se pudo completar la operación en la base de datos.";
                        break;
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

        public Respuesta<List<ECategoria>> ListaCategorias()
        {
            try
            {
                List<ECategoria> rptLista = new List<ECategoria>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListarCategorias", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.HasRows)
                            {
                                while (dr.Read())
                                {
                                    rptLista.Add(new ECategoria
                                    {
                                        IdCategoria = Convert.ToInt32(dr["IdCategoria"]),
                                        NombreCategoria = dr["NombreCategoria"].ToString(),
                                        Estado = Convert.ToBoolean(dr["Estado"])
                                    });
                                }
                            }
                        }
                    }
                }

                return new Respuesta<List<ECategoria>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ECategoria>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }
    }
}
