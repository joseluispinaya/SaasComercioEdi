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
    public class NCategoria
    {
        #region "PATRON SINGLETON"
        private static NCategoria instancia = null;
        private NCategoria() { }
        public static NCategoria GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NCategoria();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditCategorias(ECategoria objeto)
        {
            // Aquí podrías agregar validaciones lógicas antes de ir a la BD si fuera necesario
            return DCategoria.GetInstance().GuardarOrEditCategorias(objeto);
        }

        public Respuesta<List<ECategoria>> ListaCategorias()
        {
            return DCategoria.GetInstance().ListaCategorias();
        }
    }
}
