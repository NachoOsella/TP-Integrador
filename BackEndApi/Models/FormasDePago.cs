﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace BackEndApi.Models;

public partial class FormasDePago
{
    public int IdFormaDePago { get; set; }

    public string Descripcion { get; set; }

    public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();
}