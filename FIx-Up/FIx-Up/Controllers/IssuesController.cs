using FIx_Up.Models;
using FIx_Up.Dtos.IssueDtos; // Make sure to include the necessary DTOs
using FIx_Up.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FIx_Up.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IssuesController : ControllerBase
    {
        private readonly IFixupRepository<Issue, IssueReadDto, IssueCreateDto, IssueUpdateDto> _repo;

        public IssuesController(IFixupRepository<Issue, IssueReadDto, IssueCreateDto, IssueUpdateDto> repo)
        {
            _repo = repo;
        }

        // GET: api/<IssuesController>
        [HttpGet]
      
        public async Task<ActionResult<IEnumerable<IssueReadDto>>> Get()
        {
            var Issues = await _repo.GetAll(); // Get all Issues as IssueReadDto
            return Ok(Issues);
        }

        // GET api/<IssuesController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IssueReadDto>> Get(int id)
        {
            var Issue = await _repo.GetById(id); // Get a Issue by ID as IssueReadDto
            if (Issue == null)
            {
                return NotFound();
            }
            return Ok(Issue);
        }

        // POST api/<IssuesController>
        [HttpPost]
        public async Task<ActionResult<IssueReadDto>> Post(IssueCreateDto IssueDto)
        {
            // Add a new Issue, and return the IssueReadDto
            var Issue = await _repo.Add(IssueDto);
            return CreatedAtAction(nameof(Get), new { id = Issue.IssueId }, IssueDto);
        }

        // PUT api/<IssuesController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] IssueUpdateDto IssueDto)
        {
            if (id != IssueDto.IssueId)
            {
                return BadRequest();
            }

            // Update the Issue, passing the IssueUpdateDto
            await _repo.Update(IssueDto);
            return NoContent();
        }

        // DELETE api/<IssuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _repo.Delete(id);
            return NoContent();
        }
    }
}
