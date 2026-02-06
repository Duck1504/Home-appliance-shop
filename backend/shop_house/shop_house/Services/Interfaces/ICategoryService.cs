using shop_house.Models;

namespace shop_house.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<List<Category>> GetAllAsync();      
        Task<Category?> GetByIdAsync(int id);    
        Task CreateAsync(Category category);     
        Task<bool> DeleteAsync(int id);
    }
}
