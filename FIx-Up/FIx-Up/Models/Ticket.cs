using System;
using System.Collections.Generic;

namespace FIx_Up.Models;

public partial class Ticket
{
    public int TicketId { get; set; }

    public int? UserId { get; set; }

    public string IssueType { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime? CreatedDate { get; set; }

    public string? Tstatus { get; set; }

    public DateTime? ResolvedDate { get; set; }

    public byte[]? FileUpload { get; set; }

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual User? User { get; set; }
}
public class TicketEmailRequest
{
    public int TicketId { get; set; }
}
