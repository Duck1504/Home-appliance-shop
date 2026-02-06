using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using shop_house.DTOs;
using shop_house.Models;
using shop_house.Services.Interfaces;

namespace shop_house.Controllers
{

    [ApiController]
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _service;
        private readonly IWebHostEnvironment _env;

        public CategoryController(ICategoryService service,IWebHostEnvironment env)
        {
            _service = service;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _service.GetByIdAsync(id);
            if (category == null) 
                return NotFound();
            return Ok(category);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CategoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            string imageUrl = null;

            if (dto.ImageFile != null)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "category");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.ImageFile.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(stream);
                }

                imageUrl = "/images/category/" + fileName;
            }
            var category = new Category
            {
                Name = dto.Name,
                ImageUrl = imageUrl
            };
            
            await _service.CreateAsync(category);
            return Ok(category);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (result == null)
                return NotFound(new { message = "xóa không thành công" });
            return Ok(new { message = "xóa thành công"});
        }
    }
}
