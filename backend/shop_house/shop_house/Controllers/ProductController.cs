using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using shop_house.DTOs;
using shop_house.Models;
using shop_house.Services.Interfaces;

namespace shop_house.Controllers
{
 
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _service;
        private readonly IWebHostEnvironment _env;
        public ProductController(IProductService service, IWebHostEnvironment env)
        {
            _service = service;
            _env = env;
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _service.GetAllAsync();

            var result = products.Select(p => new
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Quantity = p.Quantity,
                Image = p.ProductImages
                            .FirstOrDefault(i => i.IsMain)?.ImageUrl
                        ?? p.ProductImages.FirstOrDefault()?.ImageUrl,
                CategoryName = p.Category.Name
            });

            return Ok(result);
        }

            [AllowAnonymous]
            [HttpGet("{id}")]
            public async Task<IActionResult> GetById(int id)
            {
                var p = await _service.GetByIdAsync(id);
                if (p == null) return NotFound();

                return Ok(new
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Quantity = p.Quantity,
                    Description = p.Description,
                    Nhanhieu = p.nhanhieu,
                    Kieutu = p.kieutu,
                    Dungtich = p.dungtich, 
                    Kichthuoc =p.kichthuoc,
                    Nangluongtieuthu = p.nangluongtieuthu,
                    Trongluong=p.trongluong,
                    Namsx= p.namsx,
                    Madein= p.madein,
                    Images = p.ProductImages
                        .OrderByDescending(i => i.IsMain)
                        .Select(i => new
                        {
                            i.ImageUrl,
                            i.IsMain
                        })
                });
            }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = new Product
            {
                Name = dto.Name,
                nhanhieu = dto.nhanhieu,
                Price = dto.Price,
                Quantity = dto.Quantity,
                Description = dto.Description,
                kieutu = dto.kieutu,
                dungtich = dto.dungtich,
                kichthuoc = dto.kichthuoc,
                nangluongtieuthu = dto.nangluongtieuthu,
                trongluong = dto.trongluong,
                chatlieu = dto.chatlieu,
                namsx = dto.namsx,
                madein = dto.madein,
                CategoryId = dto.CategoryId,
                ProductImages = new List<ProductImage>()
            };

            var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "products");
            Directory.CreateDirectory(uploadsFolder);

            if (dto.ImageFiles != null && dto.ImageFiles.Any())
            {
                bool isMain = true;

                foreach (var file in dto.ImageFiles)
                {
                    var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);

                    product.ProductImages.Add(new ProductImage
                    {
                        ImageUrl = "/images/products/" + fileName,
                        IsMain = isMain
                    });

                    isMain = false; // chỉ ảnh đầu là ảnh đại diện
                }
            }

            await _service.CreateAsync(product);

            return Ok(new { message = "Thêm sản phẩm thành công" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (result == null)
                return NotFound(new { message = "xóa không thành công" });
            return Ok(new { message = "xóa thành công" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = await _service.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Sản phẩm không tồn tại" });

            product.Name = dto.Name;
            product.Price = dto.Price;
            product.Quantity = dto.Quantity;
            product.Description = dto.Description;
            product.CategoryId = dto.CategoryId;

            if (dto.ImageFiles != null && dto.ImageFiles.Any())
            {
                // ❌ xóa ảnh cũ trong DB
                product.ProductImages.Clear();

                var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "products");
                Directory.CreateDirectory(uploadsFolder);

                bool isMain = true;

                foreach (var file in dto.ImageFiles)
                {
                    var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);

                    product.ProductImages.Add(new ProductImage
                    {
                        ImageUrl = "/images/products/" + fileName,
                        IsMain = isMain
                    });

                    isMain = false;
                }
            }

            await _service.UpdateAsync(product);
            return Ok(new { message = "Cập nhật sản phẩm thành công" });
        }

        [AllowAnonymous]
        [HttpGet("by-category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var products = await _service.GetByCategoryAsync(categoryId);

            var result = products.Select(p => new ProductResponseDTO
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Quantity = p.Quantity,
                Nhanhieu = p.nhanhieu,
                Dungtich = p.dungtich,
                Images = p.ProductImages
                    .OrderByDescending(i => i.IsMain)
                    .Select(i => new ProductImageDTO
                    {
                        ImageUrl = i.ImageUrl,
                        IsMain = i.IsMain
                    }).ToList()
            });

            return Ok(result);
        }

    }
}
