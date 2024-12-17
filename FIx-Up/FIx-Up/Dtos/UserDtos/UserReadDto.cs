using FIx_Up.Models;

namespace FIx_Up.Dtos.UserDtos
{
    public class UserReadDto
    {
        public int UserId { get; set; }

        public string UserName { get; set; }
        public string Email { get; set; } 

        public string UserPassword { get; set; } 

        public DateTime? DateCreated { get; set; }
        public int? RoleId { get; set; }
      
    }
}
