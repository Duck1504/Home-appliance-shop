using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shop_house.DTOs
{
    public class ProductListDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [Column(TypeName = "decimal(18,0)")]
        public decimal Price { get; set; }
        [Required, MaxLength(100)]
        public int Quantity { get; set; }
        public string ImageUrl { get; set; }
        public string CategoryName { get; set; }
    }
}
