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
    public class DUsuarioWeb
    {
        #region "PATRON SINGLETON"
        private static DUsuarioWeb instancia = null;
        private DUsuarioWeb() { }
        public static DUsuarioWeb GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DUsuarioWeb();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditUsuariosWeb(EUsuarioWeb objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditUsuariosWeb", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdUsuarioWeb", objeto.IdUsuarioWeb);
                        cmd.Parameters.AddWithValue("@IdRol", objeto.IdRol);
                        cmd.Parameters.AddWithValue("@Nombres", objeto.Nombres);
                        cmd.Parameters.AddWithValue("@Apellidos", objeto.Apellidos);
                        cmd.Parameters.AddWithValue("@NroCI", objeto.NroCI);
                        cmd.Parameters.AddWithValue("@Correo", objeto.Correo);
                        cmd.Parameters.AddWithValue("@NroContacto", objeto.NroContacto);
                        // Blindaje contra nulos en la Clave (Si es Update, puede que venga nula. La mandamos vacía para que el SP la ignore)
                        cmd.Parameters.AddWithValue("@ClaveHash", string.IsNullOrEmpty(objeto.ClaveHash) ? "" : objeto.ClaveHash);

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
                    case 1:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "El correo ingresado ya se encuentra registrado.";
                        break;
                    case 2:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Usuario registrado correctamente.";
                        break;
                    case 3:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Usuario actualizado correctamente.";
                        break;
                    case 0:
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

        public Respuesta<List<EUsuarioWeb>> ListaUsuarios()
        {
            try
            {
                List<EUsuarioWeb> rptLista = new List<EUsuarioWeb>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaUsuarios", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.HasRows)
                            {
                                while (dr.Read())
                                {
                                    rptLista.Add(new EUsuarioWeb
                                    {
                                        IdUsuarioWeb = Convert.ToInt32(dr["IdUsuarioWeb"]),
                                        IdRol = Convert.ToInt32(dr["IdRol"]),
                                        NombreRol = dr["NombreRol"].ToString(),
                                        Nombres = dr["Nombres"].ToString(),
                                        Apellidos = dr["Apellidos"].ToString(),
                                        NroCI = dr["NroCI"].ToString(),
                                        Correo = dr["Correo"].ToString(),
                                        NroContacto = dr["NroContacto"].ToString(),
                                        Estado = Convert.ToBoolean(dr["Estado"])
                                    });
                                }
                            }
                        }
                    }
                }

                return new Respuesta<List<EUsuarioWeb>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EUsuarioWeb>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<List<ERoles>> ListaRoles()
        {
            try
            {
                List<ERoles> rptLista = new List<ERoles>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_Roles", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ERoles
                                {
                                    IdRol = Convert.ToInt32(dr["IdRol"]),
                                    NombreRol = dr["NombreRol"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ERoles>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ERoles>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<DtoUsuarioSesion> LoginUnificado(string correo)
        {
            try
            {
                DtoUsuarioSesion objSesion = null;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_LoginUnificado", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@Correo", correo);

                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                objSesion = new DtoUsuarioSesion
                                {
                                    IdUsuario = Convert.ToInt32(dr["IdUsuario"]),
                                    IdRol = Convert.ToInt32(dr["IdRol"]),
                                    NombreCompleto = dr["NombreCompleto"].ToString(),
                                    Correo = dr["Correo"].ToString(),
                                    ClaveHash = dr["ClaveHash"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"]),
                                    TipoUsuario = dr["TipoUsuario"].ToString()
                                };
                            }
                        }
                    }
                }

                return new Respuesta<DtoUsuarioSesion>()
                {
                    Estado = objSesion != null,
                    Data = objSesion,
                    Mensaje = objSesion != null ? "Usuario encontrado" : "Credenciales incorrectas o usuario no registrado."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<DtoUsuarioSesion>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error en el servidor: {ex.Message}"
                };
            }
        }
    }
}
