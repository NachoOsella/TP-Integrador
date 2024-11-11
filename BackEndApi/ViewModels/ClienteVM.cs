namespace BackEndApi.ViewModels
{
    public class ClienteVM
    {
        public string Nombre { get; set; }

        public string Apellido { get; set; }

        public int? Telefono { get; set; }

        public int? IdTipoDoc { get; set; }

        public int? Dni { get; set; }
        public string Mail { get; set; }

        public string Contraseña { get; set; }

        public string RepetirContraseña { get; set; }
    }
}
