using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shop_house.DTOs.CartDto;
using shop_house.Services.Interfaces;
using System.Security.Claims;

namespace shop_house.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _service;

        public CartController(ICartService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            int userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            return Ok(await _service.GetCartAsync(userId));
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart(AddToCartDTO dto)
        {
            int userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            await _service.AddToCartAsync(userId, dto);
            return Ok(new { message = "Đã thêm vào giỏ hàng" });
        }

        [HttpPut("quantity")]
        public async Task<IActionResult> UpdateQuantity(int productId, int quantity)
        {
            int userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            await _service.UpdateQuantityAsync(userId, productId, quantity);
            return Ok();
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> RemoveItem(int productId)
        {
            int userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            await _service.RemoveItemAsync(userId, productId);
            return Ok();
        }
    }
}
