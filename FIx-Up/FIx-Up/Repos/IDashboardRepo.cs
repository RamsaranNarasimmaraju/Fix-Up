namespace FIx_Up.Repos
{
    public interface IDashboardRepo<T> where T : class
    {
        Task<IEnumerable<T>> GetAll();
    }
}
