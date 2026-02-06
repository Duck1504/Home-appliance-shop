using Microsoft.EntityFrameworkCore;
using shop_house.Data;
using shop_house.Models;
using shop_house.Services.Interfaces;

namespace shop_house.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Product?> DeleteAsync(int id)
        {
            var result = await _context.Products.FindAsync(id);
            if (result != null)
            {
                _context.Products.Remove(result);
            }
            await _context.SaveChangesAsync();
            return result;
        }
        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Product>> GetByCategoryAsync(int categoryId)
        {
            return await _context.Products
                .Include(p => p.ProductImages).Where(p => p.CategoryId == categoryId).ToListAsync();
        }
    }
}
