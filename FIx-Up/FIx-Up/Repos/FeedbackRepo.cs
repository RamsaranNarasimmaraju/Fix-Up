using FIx_Up.Models;
using FIx_Up.Dtos.FeedbackDtos;
using Microsoft.EntityFrameworkCore;

namespace FIx_Up.Repos
{
    public class FeedbackRepo : IFeedbackRepo
    {
        private readonly FixupDbContext _context;

        public FeedbackRepo(FixupDbContext context)
        {
            _context = context;
        }

        // Retrieve all feedbacks
        public async Task<IEnumerable<FeedbackReadDto>> GetAll()
        {
            return await _context.Feedbacks
                .Select(feedback => new FeedbackReadDto
                {
                    FeedbackId = feedback.FeedbackId,
                    TicketId = feedback.TicketId,
                    Rating = feedback.Rating,
                    Comments = feedback.Comments,
                    Submitteddate = feedback.Submitteddate
                })
                .ToListAsync();
        }

        // Retrieve a feedback by its ID
        public async Task<FeedbackReadDto> GetById(int id)
        {
            var feedback = await _context.Feedbacks.FindAsync(id);
            if (feedback == null) return null;

            return new FeedbackReadDto
            {
                FeedbackId = feedback.FeedbackId,
                TicketId = feedback.TicketId,
                Rating = feedback.Rating,
                Comments = feedback.Comments,
                Submitteddate = feedback.Submitteddate
            };
        }

        // Add a new feedback
        public async Task<FeedbackReadDto> Add(FeedbackCreateDto feedbackDto)
        {
            var feedback = new Feedback
            {
                TicketId = feedbackDto.TicketId,
                Rating = feedbackDto.Rating,
                Comments = feedbackDto.Comments,
                Submitteddate = feedbackDto.Submitteddate
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return new FeedbackReadDto
            {
                FeedbackId = feedback.FeedbackId,
                TicketId = feedback.TicketId,
                Rating = feedback.Rating,
                Comments = feedback.Comments,
                Submitteddate = feedback.Submitteddate
            };
        }
    }
}
