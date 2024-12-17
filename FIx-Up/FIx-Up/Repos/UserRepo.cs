using FIx_Up.Dtos.UserDtos;
using FIx_Up.Models;
using FIx_Up.Repos;
using Microsoft.EntityFrameworkCore;



namespace FIx_Up.Repos
{
    /// <summary>
    /// User repository implementing IFixupRepository interface for CRUD operations.
    /// </summary>
    public class UserRepo : IFixupRepository<User, UserReadDto, UserCreateDto, UserUpdateDto>
    {
        private readonly FixupDbContext _context;

        public UserRepo(FixupDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all users and maps them to UserReadDto.
        /// </summary>
        public async Task<IEnumerable<UserReadDto>> GetAll()
        {
            return await _context.Users
                .Select(user => new UserReadDto
                {
                    UserId = user.UserId,
                    UserName = user.UserName,
                    Email = user.Email,
                    UserPassword = user.UserPassword,
                    DateCreated = user.DateCreated,
                    RoleId = user.RoleId
                })
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a user by ID and maps it to UserReadDto.
        /// </summary>
        public async Task<UserReadDto> GetById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null;

            return new UserReadDto
            {
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                UserPassword = user.UserPassword,
                DateCreated = user.DateCreated,
                RoleId = user.RoleId
            };
        }

        /// <summary>
        /// Adds a new user and returns the created UserReadDto.
        /// </summary>
        public async Task<UserReadDto> Add(UserCreateDto userDto)
        {
            var user = new User
            {
                UserName = userDto.UserName,
                Email = userDto.Email,
                UserPassword = userDto.UserPassword,
                RoleId = userDto.RoleId,
                DateCreated = DateTime.UtcNow // Set default date to current UTC
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserReadDto
            {
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                UserPassword = user.UserPassword,
                DateCreated = user.DateCreated,
                RoleId = user.RoleId
            };
        }

        /// <summary>
        /// Updates an existing user based on the UserUpdateDto.
        /// </summary>
        public async Task Update(UserUpdateDto userDto)
        {
            var user = await _context.Users.FindAsync(userDto.UserId);
            if (user == null) return;

            // Update the properties
            user.UserName = userDto.UserName;
            user.Email = userDto.Email;
            user.UserPassword = userDto.UserPassword;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Deletes a user by ID.
        /// </summary>
        public async Task Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
    }
}