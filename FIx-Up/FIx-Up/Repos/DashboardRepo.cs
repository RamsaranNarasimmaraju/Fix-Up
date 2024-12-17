using FIx_Up.Models;
using Microsoft.EntityFrameworkCore;

namespace FIx_Up.Repos
{
    public class DashboardRepo:IDashboardRepo<Dashboard>
    {
        private readonly FixupDbContext _context;
        public DashboardRepo(FixupDbContext context)
        {
            _context = context;

        }
        public async Task<IEnumerable<Dashboard>> GetAll()
        {
            return await _context.Dashboards.ToListAsync();
        }
    }
}
