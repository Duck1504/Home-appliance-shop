using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shop_house.Models
{
    public class ProductImage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public string ImageUrl { get; set; }
        public bool IsMain { get; set; } = false;

        [ForeignKey("ProductId")]
        public Product Product { get; set; }
    }
}
