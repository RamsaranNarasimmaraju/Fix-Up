using FIx_Up.Models;
using FIx_Up.Dtos.UserDtos; // Make sure to include the necessary DTOs
using FIx_Up.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FIx_Up.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IFixupRepository<User, UserReadDto, UserCreateDto, UserUpdateDto> _repo;

        public UsersController(IFixupRepository<User, UserReadDto, UserCreateDto, UserUpdateDto> repo)
        {
            _repo = repo;
        }

        // GET: api/<UsersController>
        [HttpGet]
        [Authorize(Roles ="Admin,SupportEngineer,User")]
        public async Task<ActionResult<IEnumerable<UserReadDto>>> Get()
        {
            var users = await _repo.GetAll(); // Get all users as UserReadDto
            return Ok(users);
        }

        // GET api/<UsersController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserReadDto>> Get(int id)
        {
            var user = await _repo.GetById(id); // Get a user by ID as UserReadDto
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST api/<UsersController>
        [HttpPost]
        [Authorize(Roles ="Admin,User")]
        public async Task<ActionResult<UserReadDto>> Post( UserCreateDto userDto)
        {
            // Add a new user, and return the UserReadDto
            var user = await _repo.Add(userDto);
            return CreatedAtAction(nameof(Get), new { id =user.UserId }, userDto);
        }

        // PUT api/<UsersController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] UserUpdateDto userDto)
        {
            if (id != userDto.UserId)
            {
                return BadRequest();
            }

            // Update the user, passing the UserUpdateDto
            await _repo.Update(userDto);
            return NoContent();
        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _repo.Delete(id);
            return NoContent();
        }
    }
}
