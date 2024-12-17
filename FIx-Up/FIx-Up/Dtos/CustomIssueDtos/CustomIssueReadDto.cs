namespace FIx_Up.Dtos.CustomIssueDtos
{
    public class CustomIssueReadDto
    {
        public int CustomId { get; set; }

        public string CutomIssue { get; set; } = null!;

        public string? CustomSolution { get; set; }

        public int? Userid { get; set; }
    }
}
