namespace FIx_Up.Controllers
{
    internal class AuthenticatedResponse
    {
        public string Token { get; set; }
        public string Role { get; set; }
        public int UserId { get; set; }
    }
}