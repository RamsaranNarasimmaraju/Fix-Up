using System;
using System.Collections.Generic;

namespace FIx_Up.Models;

public partial class Dashboard
{
    public int? TotalTicketsRaised { get; set; }

    public int? TotalTicketsSolved { get; set; }

    public double? AverageRating { get; set; }
}
