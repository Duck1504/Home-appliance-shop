using shop_house.DTOs;

namespace shop_house.Services.Interfaces
{
    public interface ICheckoutService
    {
        Task<int> CheckoutAsync(int userId, CheckoutDTO dto);
    }
}
