using FIx_Up.Dtos.SolutionDtos;
using FIx_Up.Models;
using Microsoft.EntityFrameworkCore;

namespace FIx_Up.Repos
{
    public class SolutionRepo : IFixupRepository<Solution, SolutionReadDto, SolutionCreateDto, SolutionUpdateDto>
    {
        private readonly FixupDbContext _context;

        public SolutionRepo(FixupDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SolutionReadDto>> GetAll()
        {
            return await _context.Solutions
                .Select(Solution => new SolutionReadDto
                {
                    SolutionId = Solution.SolutionId,
                    Solution1 = Solution.Solution1,
                    IssueId = Solution.IssueId,

                })
                .ToListAsync();
        }

        public async Task<SolutionReadDto> GetById(int id)
        {
            var Solution = await _context.Solutions.FindAsync(id);
            if (Solution == null) return null;

            return new SolutionReadDto
            {
                SolutionId = Solution.SolutionId,
                Solution1 = Solution.Solution1,
                IssueId = Solution.IssueId,

            };
        }

        public async Task<SolutionReadDto> Add(SolutionCreateDto SolutionDto)
        {
            var Solution = new Solution
            {
                IssueId = SolutionDto.IssueId,
                Solution1 = SolutionDto.Solution1,
               
                

            };

            _context.Solutions.Add(Solution);
            await _context.SaveChangesAsync();
            var Solutionreaddtos = new SolutionReadDto
            {
                SolutionId = Solution.SolutionId,
                Solution1 = Solution.Solution1,
                IssueId = Solution.IssueId,

            };
            return Solutionreaddtos;
        }

        public async Task Update(SolutionUpdateDto SolutionDto)
        {
            var Solution = await _context.Solutions.FindAsync(SolutionDto.SolutionId);
            if (Solution == null) return;

            Solution.Solution1 = SolutionDto.Solution1;

            _context.Solutions.Update(Solution);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var Solution = await _context.Solutions.FindAsync(id);
            if (Solution != null)
            {
                _context.Solutions.Remove(Solution);
                await _context.SaveChangesAsync();
            }
        }


    }
}