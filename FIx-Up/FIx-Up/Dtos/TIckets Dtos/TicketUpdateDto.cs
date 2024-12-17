namespace FIx_Up.Dtos.TIckets_Dtos
{
    public class TicketUpdateDto
    {
        public int TicketId { get; set; }
        public int? UserId { get; set; }
        public string IssueType { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }
        public string? Tstatus { get; set; }
        public DateTime? ResolvedDate { get; set; }

       
        
    }
}
