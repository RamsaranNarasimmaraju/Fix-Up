using System;
using System.Collections.Generic;

namespace FIx_Up.Models;

public partial class Solution
{
    public int SolutionId { get; set; }

    public int? IssueId { get; set; }

    public string Solution1 { get; set; } = null!;

    public virtual Issue? Issue { get; set; }
}
