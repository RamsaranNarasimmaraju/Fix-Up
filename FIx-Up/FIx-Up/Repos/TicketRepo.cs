using FIx_Up.Dtos.TIckets_Dtos;
using FIx_Up.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FIx_Up.Repos
{
    public class TicketRepo : IFixupRepository<Ticket, TicketReadDto, TicketCreateDto, TicketUpdateDto>
    {
        private readonly FixupDbContext _context;

        public TicketRepo(FixupDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<TicketReadDto>> GetAll()
        {
            return await _context.Tickets
                .Select(ticket => new TicketReadDto
                {
                    TicketId = ticket.TicketId,
                    UserId = ticket.UserId,
                    IssueType = ticket.IssueType,
                    Description = ticket.Description,
                    CreatedDate = ticket.CreatedDate,
                    Tstatus = ticket.Tstatus,
                    ResolvedDate = ticket.ResolvedDate,
                    FileUpload = ticket.FileUpload
                })
                .ToListAsync();
        }

        public async Task<TicketReadDto> GetById(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return null;

            return new TicketReadDto
            {
                TicketId = ticket.TicketId,
                UserId = ticket.UserId,
                IssueType = ticket.IssueType,
                Description = ticket.Description,
                CreatedDate = ticket.CreatedDate,
                Tstatus = ticket.Tstatus,
                ResolvedDate = ticket.ResolvedDate,
                FileUpload = ticket.FileUpload
            };
        }

        // Inside your TicketRepo.cs, you should convert IFormFile to byte[]
        public async Task<TicketReadDto> Add(TicketCreateDto ticketDto)
        {
            var ticket = new Ticket
            {
                IssueType = ticketDto.IssueType,
                Description = ticketDto.Description,
                UserId = ticketDto.UserId,
                CreatedDate =ticketDto.CreatedDate, // Parse the created date
                FileUpload = ticketDto.FileUpload
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return new TicketReadDto
            {
                TicketId = ticket.TicketId,
                UserId = ticket.UserId,
                IssueType = ticket.IssueType,
                Description = ticket.Description,
                CreatedDate = ticket.CreatedDate,
                Tstatus = ticket.Tstatus,
                ResolvedDate = ticket.ResolvedDate,
                FileUpload = ticket.FileUpload
            };
        }

        public async Task Update(TicketUpdateDto ticketDto)
        {
            var ticket = await _context.Tickets.FindAsync(ticketDto.TicketId);
            if (ticket == null) return;

            ticket.UserId = ticketDto.UserId;
            ticket.IssueType = ticketDto.IssueType;
            ticket.Description = ticketDto.Description;
            ticket.CreatedDate = ticketDto.CreatedDate;
            ticket.Tstatus = ticketDto.Tstatus;
            ticket.ResolvedDate = ticketDto.ResolvedDate;

       

            _context.Tickets.Update(ticket);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket != null)
            {
                _context.Tickets.Remove(ticket);
                await _context.SaveChangesAsync();
            }
        }
    }
}
