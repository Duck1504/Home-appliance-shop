using shop_house.DTOs.CartDto;

namespace shop_house.Services.Interfaces
{
    public interface ICartService
    {
        Task<List<CartItemDTO>> GetCartAsync(int userId);
        Task AddToCartAsync(int userId, AddToCartDTO dto);
        Task UpdateQuantityAsync(int userId, int productId, int quantity);
        Task RemoveItemAsync(int userId, int productId);
    }
}
