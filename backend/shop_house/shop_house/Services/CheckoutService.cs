using Microsoft.EntityFrameworkCore;
using shop_house.Data;
using shop_house.DTOs;
using shop_house.Models;
using shop_house.Services.Interfaces;
using System;

namespace shop_house.Services
{
    public class CheckoutService : ICheckoutService
    {
        private readonly ApplicationDbContext _context;

        public CheckoutService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> CheckoutAsync(int userId, CheckoutDTO dto)
        {
            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.Cart.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
                throw new Exception("Giỏ hàng trống");

            decimal totalAmount = cartItems.Sum(i => i.Product.Price * i.Quantity);

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.Now,
                TotalAmount = totalAmount,
                Status = "Pending",
                ReceiverName = dto.ReceiverName,
                Phone = dto.Phone,
                Address = dto.Address,
                PaymentMethod = dto.PaymentMethod,
                OrderDetails = new List<OrderDetail>()
            };

            foreach (var item in cartItems)
            {
                order.OrderDetails.Add(new OrderDetail
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Product.Price
                });

                item.Product.Quantity -= item.Quantity;
            }

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            return order.Id;
        }
    }

}
