using FIx_Up.Dtos.IssueDtos;
using FIx_Up.Models;
using Microsoft.EntityFrameworkCore;

namespace FIx_Up.Repos
{
    public class IssueRepo : IFixupRepository<Issue, IssueReadDto, IssueCreateDto, IssueUpdateDto>
    {
        private readonly FixupDbContext _context;

        public IssueRepo(FixupDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<IssueReadDto>> GetAll()
        {
            return await _context.Issues
                .Select(Issue => new IssueReadDto
                {
                    IssueId = Issue.IssueId,
                    IssueCategory = Issue.IssueCategory,
                    
                })
                .ToListAsync();
        }

        public async Task<IssueReadDto> GetById(int id)
        {
            var Issue = await _context.Issues.FindAsync(id);
            if (Issue == null) return null;

            return new IssueReadDto
            {
                IssueId = Issue.IssueId,
                IssueCategory = Issue.IssueCategory,

            };
        }

        public async Task<IssueReadDto> Add(IssueCreateDto IssueDto)
        {
            var Issue = new Issue
            {
                IssueCategory = IssueDto.IssueCategory,
                
            };

            _context.Issues.Add(Issue);
            await _context.SaveChangesAsync();
            var Issuereaddtos = new IssueReadDto
            {
                IssueId = Issue.IssueId,
                IssueCategory = Issue.IssueCategory,
               
            };
            return Issuereaddtos;
        }

        public async Task Update(IssueUpdateDto IssueDto)
        {
            var Issue = await _context.Issues.FindAsync(IssueDto.IssueId);
            if (Issue == null) return;

            Issue.IssueCategory = IssueDto.IssueCategory;
           
            _context.Issues.Update(Issue);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var Issue = await _context.Issues.FindAsync(id);
            if (Issue != null)
            {
                _context.Issues.Remove(Issue);
                await _context.SaveChangesAsync();
            }
        }


    }
}