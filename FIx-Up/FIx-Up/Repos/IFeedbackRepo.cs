using FIx_Up.Models;
using FIx_Up.Dtos;
using FIx_Up.Dtos.FeedbackDtos;

namespace FIx_Up.Repos
{
    public interface IFeedbackRepo
    {
        Task<IEnumerable<FeedbackReadDto>> GetAll();
        Task<FeedbackReadDto> GetById(int id);
        Task<FeedbackReadDto> Add(FeedbackCreateDto feedback);
    }
}
