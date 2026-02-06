using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shop_house.DTOs;
using shop_house.Models;
using shop_house.Services.Interfaces;
using System.Security.Claims;

namespace shop_house.Controllers
{
    [ApiController]
    [Route("api/checkout")]
    [Authorize]
    public class CheckoutController : ControllerBase
    {
        private readonly ICheckoutService _checkoutService;

        public CheckoutController(ICheckoutService checkoutService)
        {
            _checkoutService = checkoutService;
        }

        [HttpPost]
        public async Task<IActionResult> Checkout(CheckoutDTO dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var orderId = await _checkoutService.CheckoutAsync(userId, dto);

            return Ok(new
            {
                message = "Đặt hàng thành công",
                orderId
            });
        }
    }

}
