using System;
using System.Collections.Generic;

namespace FIx_Up.Models;

public partial class User
{
    public int UserId { get; set; }

    public string UserName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string UserPassword { get; set; } = null!;

    public int? RoleId { get; set; }

    public DateTime? DateCreated { get; set; }

    public virtual ICollection<CustomIssue> CustomIssues { get; set; } = new List<CustomIssue>();

    public virtual Role? Role { get; set; }

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
