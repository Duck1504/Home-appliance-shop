using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace shop_house.DTOs
{
    public class ProductCreateDTO
    {
        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        [StringLength(100, ErrorMessage = "Tối đa 100 ký tự")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Không để trống nơi sản xuất sản phẩm")]
        public string nhanhieu { get; set; }

        [Column(TypeName = "decimal(18,0)")]
        public decimal Price { get; set; }

        [Range(0, 10000)]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Mô tả không được để trống")]
        [StringLength(500, ErrorMessage = "Mô tả tối đa 500 ký tự")]
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

        [Required(ErrorMessage = "Vui lòng chọn hình ảnh")]
        public List<IFormFile> ImageFiles { get; set; }
    }

}
