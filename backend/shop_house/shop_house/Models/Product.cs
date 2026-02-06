using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shop_house.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Không để trống tên sản phẩm")]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Không để trống nơi sản xuất sản phẩm")]
        public string nhanhieu { get; set; }

        [Required]
        [Range(0, 1000000000, ErrorMessage = "Giá phải > 0")]
        [Column(TypeName = "decimal(18,0)")]
        public decimal Price { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Không để trống mô tả sản phẩm")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Không để trống kiểu tủ sản phẩm")]
        public string kieutu { get; set; }

        [Required(ErrorMessage = "Không để trống dung tích sản phẩm")]
        public string dungtich { get; set; }

        [Required(ErrorMessage = "Không để trống kích thước sản phẩm")]
        public string kichthuoc { get; set; }

        [Required(ErrorMessage = "Không để năng lượng tiêu thụ sản phẩm")]
        public string nangluongtieuthu { get; set; }

        [Required(ErrorMessage = "Không để trọng lượng sản phẩm")]
        public string trongluong { get; set; }

        [Required(ErrorMessage = "Không để trống mô tả sản phẩm")]
        public string chatlieu { get; set; }

        [Required(ErrorMessage = "Không để trống năm sản sản phẩm")]
        public int namsx { get; set; }

        [Required(ErrorMessage = "Không để trống nơi sản xuất sản phẩm")]
        public string madein { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category Category { get; set; }

        public ICollection<ProductImage> ProductImages { get; set; }

        public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
