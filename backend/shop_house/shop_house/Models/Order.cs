using System.ComponentModel.DataAnnotations.Schema;

namespace shop_house.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        [Column(TypeName = "decimal(18,0)")]
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } 
        public User User { get; set; }
        public string ReceiverName { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string PaymentMethod { get; set; } 
        public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
