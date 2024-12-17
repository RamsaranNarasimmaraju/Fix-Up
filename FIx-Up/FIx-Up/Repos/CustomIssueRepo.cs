using FIx_Up.Dtos.CustomIssueDtos;
using FIx_Up.Models;
using Microsoft.EntityFrameworkCore;

namespace FIx_Up.Repos
{
    public class CustomIssueRepo : IFixupRepository<CustomIssue, CustomIssueReadDto, CustomIssueCreateDto, CustomIssueUpdateDto>
    {
        private readonly FixupDbContext _context;

        public CustomIssueRepo(FixupDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CustomIssueReadDto>> GetAll()
        {
            return await _context.CustomIssues
                .Select(CustomIssue => new CustomIssueReadDto
                {
                    CustomId = CustomIssue.CustomId,
                    CutomIssue = CustomIssue.CutomIssue,
                    CustomSolution = CustomIssue.CustomSolution,
                    Userid = CustomIssue.Userid,

                })
                .ToListAsync();
        }

        public async Task<CustomIssueReadDto> GetById(int id)
        {
            var CustomIssue = await _context.CustomIssues.FindAsync(id);
            if (CustomIssue == null) return null;

            return new CustomIssueReadDto
            {
                CustomId = CustomIssue.CustomId,
                CutomIssue = CustomIssue.CutomIssue,
                CustomSolution = CustomIssue.CustomSolution,
                Userid = CustomIssue.Userid,

            };
        }

        public async Task<CustomIssueReadDto> Add(CustomIssueCreateDto CustomIssueDto)
        {
            var CustomIssue = new CustomIssue
            {
             
                CutomIssue = CustomIssueDto.CutomIssue,
                CustomSolution = CustomIssueDto.CustomSolution,
                Userid = CustomIssueDto.Userid,


            };

            _context.CustomIssues.Add(CustomIssue);
            await _context.SaveChangesAsync();
            var CustomIssuereaddtos = new CustomIssueReadDto
            {
                CustomId = CustomIssue.CustomId,
                CutomIssue = CustomIssue.CutomIssue,
                CustomSolution = CustomIssue.CustomSolution,
                Userid = CustomIssue.Userid,

            };
            return CustomIssuereaddtos;
        }

        public async Task Update(CustomIssueUpdateDto CustomIssueDto)
        {
            var CustomIssue = await _context.CustomIssues.FindAsync(CustomIssueDto.CustomId);
            if (CustomIssue == null) return;

            CustomIssue.CutomIssue = CustomIssueDto.CutomIssue;
            CustomIssue.CustomSolution = CustomIssueDto.CustomSolution;

            _context.CustomIssues.Update(CustomIssue);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var CustomIssue = await _context.CustomIssues.FindAsync(id);
            if (CustomIssue != null)
            {
                _context.CustomIssues.Remove(CustomIssue);
                await _context.SaveChangesAsync();
            }
        }


    }
}

