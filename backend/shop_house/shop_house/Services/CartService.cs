using Microsoft.EntityFrameworkCore;
using shop_house.Data;
using shop_house.DTOs;
using shop_house.DTOs.CartDto;
using shop_house.Models;
using shop_house.Services.Interfaces;
using System;

namespace shop_house.Services
{
    public class CartService : ICartService
    {
        private readonly ApplicationDbContext _context;

        public CartService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<CartItemDTO>> GetCartAsync(int userId)
        {
            return await _context.CartItems
        .Where(ci => ci.Cart.UserId == userId)
        .Select(ci => new CartItemDTO
        {
            ProductId = ci.ProductId,
            ProductName = ci.Product.Name,
            ImageUrl = ci.Product.ProductImages
                .Where(pi => pi.IsMain)
                .Select(pi => pi.ImageUrl)
                .FirstOrDefault(),
            Price = ci.Price,
            Quantity = ci.Quantity,
            ProductQuantity = ci.Product.Quantity 
        })
        .ToListAsync();
        }

        public async Task AddToCartAsync(int userId, AddToCartDTO dto)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    CartItems = new List<CartItem>()
                };
                _context.Carts.Add(cart);
            }

            var item = cart.CartItems
                .FirstOrDefault(i => i.ProductId == dto.ProductId);

            if (item != null)
            {
                item.Quantity += dto.Quantity;
            }
            else
            {
                var product = await _context.Products.FindAsync(dto.ProductId);
                if (product == null) throw new Exception("Product not found");

                cart.CartItems.Add(new CartItem
                {
                    ProductId = product.Id,
                    Quantity = dto.Quantity,
                    Price = product.Price
                });
            }

            await _context.SaveChangesAsync();
        }

        public async Task UpdateQuantityAsync(int userId, int productId, int quantity)
        {
            var item = await _context.CartItems
                .Include(i => i.Product)
                .FirstOrDefaultAsync(i =>
                    i.Cart.UserId == userId &&
                    i.ProductId == productId);

            if (item == null) return;

            if (quantity > item.Product.Quantity)
                return;

            if (quantity <= 0)
                _context.CartItems.Remove(item);
            else
                item.Quantity = quantity;

            await _context.SaveChangesAsync();
        }

        public async Task RemoveItemAsync(int userId, int productId)
        {
            var item = await _context.CartItems
                .FirstOrDefaultAsync(i =>
                    i.Cart.UserId == userId &&
                    i.ProductId == productId);

            if (item == null) return;

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

}
