namespace FIx_Up.Dtos.UserDtos
{
    public class UserCreateDto
    {
        public string UserName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string UserPassword { get; set; } = null!;

        public int? RoleId { get; set; }

        
    }
}
