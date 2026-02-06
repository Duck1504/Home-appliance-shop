namespace shop_house.DTOs
{
    public class ProductResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string Nhanhieu { get; set; }   
        public string Dungtich { get; set; }
        public List<ProductImageDTO> Images { get; set; }
    }
}
