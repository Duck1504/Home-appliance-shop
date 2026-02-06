using shop_house.DTOs;

namespace shop_house.Services.Interfaces
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterDTO dto);
        Task<LoginResponseDTO> LoginAsync(LoginDTO dto);
    }
}
