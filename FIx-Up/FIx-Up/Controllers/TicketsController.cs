using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FIx_Up.Dtos.TIckets_Dtos;
using FIx_Up.Dtos.UserDtos;
using FIx_Up.Models;
using FIx_Up.Repos;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

namespace FIx_Up.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly TicketRepo _ticketRepo;
        private readonly UserRepo _userRepo; // Added UserRepo
        private readonly IConfiguration _configuration;

        public TicketsController(TicketRepo ticketRepo, UserRepo userRepo, IConfiguration configuration)
        {
            _ticketRepo = ticketRepo;
            _userRepo = userRepo; // Inject UserRepo
            _configuration = configuration;
        }

        // GET: api/Tickets
        [HttpGet]
        [Authorize(Roles ="Support Engineer,User")]
        public async Task<ActionResult<IEnumerable<TicketReadDto>>> GetTickets()
        {
            var tickets = await _ticketRepo.GetAll();
            return Ok(tickets);
        }

        // GET: api/Tickets/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketReadDto>> GetTicketById(int id)
        {
            var ticket = await _ticketRepo.GetById(id);

            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }

        // POST: api/Tickets
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromForm] TicketCreateDto ticketDto, IFormFile? file)
        {
            if (file != null && file.Length > 0)
            {
                ticketDto.FileUpload = await ConvertFileToBytes(file);
            }

            var createdTicket = await _ticketRepo.Add(ticketDto);

            return CreatedAtAction(nameof(GetTicketById), new { id = createdTicket.TicketId }, createdTicket);
        }

        // PUT: api/Tickets/{id}
        [HttpPut("{id}")]
        [Authorize(Roles ="Support Engineer")]
        public async Task<IActionResult> UpdateTicket(int id, [FromBody] TicketUpdateDto ticketDto)
        {
            if (id != ticketDto.TicketId)
            {
                return BadRequest("Ticket ID mismatch.");
            }

            await _ticketRepo.Update(ticketDto);

            return NoContent();
        }

        // DELETE: api/Tickets/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            await _ticketRepo.Delete(id);
            return NoContent();
        }

        // POST: api/Tickets/sendClosureEmail
        [HttpPost("sendClosureEmail")]
        public async Task<IActionResult> SendClosureEmail([FromBody] TicketEmailRequest request)
        {
            if (request?.TicketId == null || request.TicketId <= 0)
            {
                return BadRequest("Invalid Ticket ID.");
            }

            // Fetch the ticket from your database based on the TicketId
            var ticket = await _ticketRepo.GetById(request.TicketId);
            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            // Proceed with sending the email logic
            var user = await _userRepo.GetById(ticket.UserId.Value);
            if (user == null || string.IsNullOrEmpty(user.Email))
            {
                return NotFound("User not found or user does not have an email.");
            }

            try
            {
                SendEmail(user.Email, ticket.Tstatus, ticket.ResolvedDate); // Your email sending logic
                return Ok("Email sent successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // Helper Method: Send Email
        private void SendEmail(string recipientEmail, string? status, DateTime? resolvedDate)
        {
            var smtpClient = new SmtpClient(_configuration["EmailSettings:SmtpServer"])
            {
                Port = int.Parse(_configuration["EmailSettings:Port"]),
                Credentials = new NetworkCredential(
                    _configuration["EmailSettings:SenderEmail"],
                    _configuration["EmailSettings:SenderPassword"]),
                EnableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"]),
            };

            // Set the sender and recipient details
            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["EmailSettings:SenderEmail"]),
                Subject = "Ticket Resolved Successfully",
                Body = $@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Ticket Status Update</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7fc;
        }}
        .container {{
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }}
        h1 {{
            color: #4CAF50;
            font-size: 24px;
            text-align: center;
        }}
        p {{
            font-size: 16px;
            line-height: 1.5;
            color: #555555;
            margin: 15px 0;
        }}
        .footer {{
            text-align: center;
            font-size: 14px;
            color: #888888;
            margin-top: 20px;
        }}
        .button {{
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            text-align: center;
            border-radius: 4px;
            text-decoration: none;
            font-size: 16px;
            margin-top: 20px;
        }}
        .button:hover {{
            background-color: #45a049;
        }}
    </style>
</head>
<body>
    <div class='container'>
        <h1>Your Ticket Has Been Resolved!</h1>
        <p>Dear Customer,</p>
        <p>We are pleased to inform you that your ticket has been resolved successfully. Thank you for your patience.</p>
        <p>Resolved Date: <strong>{resolvedDate?.ToString("yyyy-MM-dd") ?? "N/A"}</strong></p>
        <p>If you have any further questions, feel free to reach out to our support team.</p>
        
        <a href='mailto:fixup600@gmail.com' class='button'>Contact Support</a>
        
        <p class='footer'>Thank you for choosing <strong>Fix_up</strong>!</p>
        <p class='footer'>If you did not request this, please ignore this message.</p>
    </div>
</body>
</html>
",
                IsBodyHtml = true, // This ensures the body is interpreted as HTML
            };
            mailMessage.To.Add(recipientEmail);

            try
            {
                // Send the email asynchronously
                smtpClient.Send(mailMessage);
            }
            catch (SmtpException smtpEx)
            {
                // Log SMTP-specific error
                Console.WriteLine($"SMTP Exception: {smtpEx.Message}");
                throw new Exception("SMTP Error: " + smtpEx.Message);
            }
            catch (Exception ex)
            {
                // Log general error
                Console.WriteLine($"General Exception: {ex.Message}");
                throw new Exception("General Error: " + ex.Message);
            }
        }




        // Convert IFormFile to byte[]
        private async Task<byte[]> ConvertFileToBytes(IFormFile file)
        {
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                return ms.ToArray();
            }
        }
    }
}