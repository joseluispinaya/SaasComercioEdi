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
    public class DCliente
    {
        #region "PATRON SINGLETON"
        private static DCliente instancia = null;
        private DCliente() { }
        public static DCliente GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DCliente();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditClientes(ECliente objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditClientes", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdCliente", objeto.IdCliente);
                        cmd.Parameters.AddWithValue("@NombreCompleto", objeto.NombreCompleto);
                        cmd.Parameters.AddWithValue("@NroCI", objeto.NroCI);
                        cmd.Parameters.AddWithValue("@Correo", objeto.Correo);
                        cmd.Parameters.AddWithValue("@NroContacto", objeto.NroContacto);

                        // Blindaje contra nulos en la Clave (Si es Update, puede que venga nula. La mandamos vacía para que el SP la ignore)
                        cmd.Parameters.AddWithValue("@ClaveHash", string.IsNullOrEmpty(objeto.ClaveHash) ? "" : objeto.ClaveHash);


                        cmd.Parameters.AddWithValue("@UbicacionNegocio", objeto.UbicacionNegocio);
                        cmd.Parameters.AddWithValue("@Latitud", objeto.Latitud);
                        cmd.Parameters.AddWithValue("@Longitud", objeto.Longitud);
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
                        response.Mensaje = "El correo ingresado ya se encuentra registrado.";
                        break;
                    case 2: // Registro Nuevo
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Cuenta creada exitosamente.";
                        break;
                    case 3: // Actualización
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Perfil actualizado correctamente.";
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

        public Respuesta<List<ECliente>> ListaClientes()
        {
            try
            {
                List<ECliente> rptLista = new List<ECliente>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaClientes", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.HasRows)
                            {
                                while (dr.Read())
                                {
                                    rptLista.Add(new ECliente
                                    {
                                        IdCliente = Convert.ToInt32(dr["IdCliente"]),
                                        NombreCompleto = dr["NombreCompleto"].ToString(),
                                        NroCI = dr["NroCI"].ToString(),
                                        Correo = dr["Correo"].ToString(),
                                        NroContacto = dr["NroContacto"].ToString(),
                                        UbicacionNegocio = dr["UbicacionNegocio"].ToString(),
                                        Latitud = Convert.ToDecimal(dr["Latitud"]),
                                        Longitud = Convert.ToDecimal(dr["Longitud"]),
                                        Estado = Convert.ToBoolean(dr["Estado"])
                                    });
                                }
                            }
                        }
                    }
                }

                return new Respuesta<List<ECliente>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ECliente>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }
    }
}
