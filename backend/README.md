*Backend - Home Appliance Shop

Backend được xây dựng bằng ASP.NET Core Web API, tạo các API phục vụ cho website bán đồ gia dụng.

->Chức năng chính

+ Xác thực và phân quyền
  - Đăng ký, đăng nhập người dùng
  - Sử dụng JWT Authentication
  - Phân quyền người dùng và quản trị viên

+ Quản lý danh mục
  - Thêm, sửa, xóa danh mục sản phẩm
  - Lấy danh sách danh mục

+ Quản lý sản phẩm
  - Thêm, sửa, xóa sản phẩm
  - Upload hình ảnh sản phẩm
  - Lấy danh sách và chi tiết sản phẩm

+ Giỏ hàng
  - Thêm sản phẩm vào giỏ hàng
  - Cập nhật số lượng
  - Xóa sản phẩm khỏi giỏ hàng
  - Tính tổng tiền

+ Đơn hàng
  - Tạo đơn hàng từ giỏ hàng
  - Xem lịch sử đơn hàng
  - Quản lý trạng thái đơn hàng

+ Cung cấp API cho frontend
  - Trả dữ liệu dạng JSON
  - Kết nối với frontend bằng HTTP/REST API

-> Công nghệ sử dụng
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
