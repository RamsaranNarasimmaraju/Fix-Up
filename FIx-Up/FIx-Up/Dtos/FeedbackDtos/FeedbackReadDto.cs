namespace FIx_Up.Dtos.FeedbackDtos
{
    public class FeedbackReadDto
    {
        public int FeedbackId { get; set; }

        public int? TicketId { get; set; }

        public int Rating { get; set; }

        public string? Comments { get; set; }

        public DateTime? Submitteddate { get; set; }
    }
}
