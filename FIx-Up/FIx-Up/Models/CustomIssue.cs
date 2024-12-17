using System;
using System.Collections.Generic;

namespace FIx_Up.Models;

public partial class CustomIssue
{
    public int CustomId { get; set; }

    public string CutomIssue { get; set; } = null!;

    public string? CustomSolution { get; set; }

    public int? Userid { get; set; }

    public virtual User? User { get; set; }
}
