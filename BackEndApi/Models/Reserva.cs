﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace BackEndApi.Models;

public partial class Reserva
{
    public int IdReserva { get; set; }

    public int? IdCliente { get; set; }

    public int? NroFuncion { get; set; }

    public DateTime? FechaReserva { get; set; }

    public bool? Confirmacion { get; set; }

    public virtual Cliente IdClienteNavigation { get; set; }

    public virtual Funcione NroFuncionNavigation { get; set; }
}