using System.ComponentModel.DataAnnotations;
namespace shop_house.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Không để trống tên danh mục")]
        [MaxLength(100)]
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public ICollection<Product>? Products { get; set; }
    }
}
