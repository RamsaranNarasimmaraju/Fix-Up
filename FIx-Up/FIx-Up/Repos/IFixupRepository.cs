public interface IFixupRepository<TEntity, TReadDto, TCreateDto, TUpdateDto>
{
    Task<IEnumerable<TReadDto>> GetAll();
    Task<TReadDto> GetById(int id);
    Task<TReadDto>Add(TCreateDto entityDto);
    Task Update(TUpdateDto entityDto);
    Task Delete(int id);
}
