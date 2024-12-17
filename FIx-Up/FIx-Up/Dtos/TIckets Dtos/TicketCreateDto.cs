namespace FIx_Up.Dtos.TIckets_Dtos
{
    public class TicketCreateDto
    {
         public int? UserId { get; set; }
        public string IssueType { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }
        public byte[]? FileUpload { get; set; }
    }
}
