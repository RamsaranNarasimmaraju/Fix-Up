using System;
using System.Collections.Generic;

namespace FIx_Up.Models;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public int? TicketId { get; set; }

    public int Rating { get; set; }

    public string? Comments { get; set; }

    public DateTime? Submitteddate { get; set; }

    public virtual Ticket? Ticket { get; set; }
}
