using System.ComponentModel.DataAnnotations;

namespace shop_house.DTOs
{
    public class CheckoutDTO
    {
        [Required]
        public string Address { get; set; }
        [Required]
        public string Phone { get; set; }
        public string ReceiverName { get; set; }
        public string PaymentMethod { get; set; }
    }
}
