using CapaDatos;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NCliente
    {
        #region "PATRON SINGLETON"
        private static NCliente instancia = null;
        private NCliente() { }
        public static NCliente GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NCliente();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditClientes(ECliente objeto)
        {
            return DCliente.GetInstance().GuardarOrEditClientes(objeto);
        }

        public Respuesta<List<ECliente>> ListaClientes()
        {
            return DCliente.GetInstance().ListaClientes();
        }
    }
}
