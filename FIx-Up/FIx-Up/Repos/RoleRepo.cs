using FIx_Up.Dtos.RoleDtos;
using FIx_Up.Models;
using Microsoft.EntityFrameworkCore;

namespace FIx_Up.Repos
{
    public class RoleRepo : IFixupRepository<Role,RoleReadDto, RoleCreateDto, RoleUpdateDto>
    {
        private readonly FixupDbContext _context;

        public RoleRepo(FixupDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RoleReadDto>> GetAll()
        {
            return await _context.Roles
                .Select(Role => new RoleReadDto
                {
                    RoleId = Role.RoleId,
                    RoleName = Role.RoleName,
                   
                })
                .ToListAsync();
        }

        public async Task<RoleReadDto> GetById(int id)
        {
            var Role = await _context.Roles.FindAsync(id);
            if (Role == null) return null;

            return new RoleReadDto
            {
                RoleId = Role.RoleId,
                RoleName = Role.RoleName,
               
            };
        }

        public async Task<RoleReadDto> Add(RoleCreateDto RoleDto)
        {
            var Role = new Role
            {
                RoleName = RoleDto.RoleName,
               
            };

            _context.Roles.Add(Role);
            await _context.SaveChangesAsync();
            var Rolereaddtos = new RoleReadDto
            {
                RoleId = Role.RoleId,
                RoleName = Role.RoleName,
              
            };
            return Rolereaddtos;
        }

        public async Task Update(RoleUpdateDto RoleDto)
        {
            var Role = await _context.Roles.FindAsync(RoleDto.RoleId);
            if (Role == null) return;

            Role.RoleName = RoleDto.RoleName;
          
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var Role = await _context.Roles.FindAsync(id);
            if (Role != null)
            {
                _context.Roles.Remove(Role);
                await _context.SaveChangesAsync();
            }
        }


    }
}
