namespace FIx_Up.Dtos.UserDtos
{
    public class UserUpdateDto
    {
        public int UserId { get; set; }

        public string UserName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string UserPassword { get; set; } = null!;
    }
}
