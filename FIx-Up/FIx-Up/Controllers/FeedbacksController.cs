using FIx_Up.Dtos.FeedbackDtos;
using FIx_Up.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FIx_Up.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbacksController : ControllerBase
    {
        private readonly IFeedbackRepo _repo;

        public FeedbacksController(IFeedbackRepo repo)
        {
            _repo = repo;
        }

        // GET: api/<FeedbackController>
        [HttpGet]
        [Authorize(Roles = "Admin")]

        public async Task<ActionResult<IEnumerable<FeedbackReadDto>>> Get()
        {
            var feedbacks = await _repo.GetAll(); // Get all feedbacks
            return Ok(feedbacks);
        }

        // GET api/<FeedbackController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FeedbackReadDto>> Get(int id)
        {
            var feedback = await _repo.GetById(id); // Get feedback by ID
            if (feedback == null)
            {
                return NotFound();
            }
            return Ok(feedback);
        }

        // POST api/<FeedbackController>
        [HttpPost]
        public async Task<ActionResult<FeedbackReadDto>> Post([FromBody] FeedbackCreateDto feedbackDto)
        {
            var feedback = await _repo.Add(feedbackDto); // Add a new feedback
            return CreatedAtAction(nameof(Get), new { id = feedback.FeedbackId }, feedback);
        }
    }
}
