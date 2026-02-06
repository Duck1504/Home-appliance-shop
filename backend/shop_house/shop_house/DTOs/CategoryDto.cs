using System.ComponentModel.DataAnnotations;

namespace shop_house.DTOs
{
    public class CategoryDto
    {
        [Required(ErrorMessage = "Không để trống tên danh mục")]
        [MaxLength(100)]
        public string Name { get; set; }
        public IFormFile ImageFile { get; set; }
    }
}
