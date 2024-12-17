using System;
using System.Collections.Generic;

namespace FIx_Up.Models;

public partial class Issue
{
    public int IssueId { get; set; }

    public string IssueCategory { get; set; } = null!;

    public virtual ICollection<Solution> Solutions { get; set; } = new List<Solution>();
}
