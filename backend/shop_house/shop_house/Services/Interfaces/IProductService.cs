using Microsoft.AspNetCore.Mvc;
using shop_house.Models;

namespace shop_house.Services.Interfaces
{
    public interface IProductService
    {
        Task<List<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task CreateAsync(Product product);
        Task<Product?> DeleteAsync(int id);
        Task UpdateAsync(Product product);
        Task<List<Product>> GetByCategoryAsync(int categoryId);
    }
}
