using FIx_Up.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace FIx_Up.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly FixupDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(FixupDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Login to authenticate and get JWT token
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login user)
        {
            if (user == null)
            {
                return BadRequest("Invalid client request");
            }

            // Retrieve user from the database using EF Core
            var existingUser = await _context.Users
                .Include(u => u.Role) // Include the role data
                .FirstOrDefaultAsync(u => u.UserName == user.UserName && u.UserPassword == user.UserPassword);

            if (existingUser == null)
            {
                return Unauthorized(); // Invalid username or password
            }

            // Check if the role exists in the database
            if (existingUser.Role == null)
            {
                return Unauthorized("User role not found in the system");
            }

            // Create JWT token for authenticated user
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var signinCredential = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            // Add role-based claim from the Role table
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, existingUser.UserName),
        
       
       
        new Claim(ClaimTypes.Role, existingUser.Role.RoleName),
         new Claim("UserId", existingUser.UserId.ToString())// Use the RoleName from the database
    };

            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: signinCredential
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return Ok(new AuthenticatedResponse { Token = tokenString , Role = existingUser.Role.RoleName, UserId = existingUser.UserId });
        }


       
    }

}

   

