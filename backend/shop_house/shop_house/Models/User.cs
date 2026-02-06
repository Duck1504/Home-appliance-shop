using System.ComponentModel.DataAnnotations;

namespace shop_house.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "User";
        public ICollection<Order> Orders { get; set; }
    }
}
