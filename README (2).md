# Hệ thống Quản lý Tuyển sinh Đại học Trực tuyến

Hệ thống full stack quản lý tuyển sinh trực tuyến đại học xây dựng bằng React 18, TypeScript, Ant Design.

## Tính năng
### Thí sinh
- Đăng ký / Đăng nhập tài khoản
- Quản lý hồ sơ cá nhân
- Nộp đơn xét tuyển với khả năng tải lên tài liệu
- Theo dõi trạng thái đơn đăng ký
- Xem kết quả xét tuyển
- Nhận thông báo

### Quản trị viên
- Bảng điều khiển với phân tích và biểu đồ
- Quản lý trường đại học (Thêm/Sửa/Xóa)
- Quản lý ngành học (Thêm/Sửa/Xóa)
- Quản lý tổ hợp môn (Thêm/Sửa/Xóa)
- Xem xét và quyết định đơn đăng ký (Phê duyệt/Từ chối)
- Quản lý người dùng (Khóa/Mở khóa tài khoản, đặt lại mật khẩu)

## Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript
- **Thư viện giao diện**: Ant Design 5.x
- **Định tuyến**: React Router v6
- **Biểu đồ**: Recharts
- **Quản lý trạng thái**: Context API
- **Lưu trữ**: localStorage (không backend)

## Cài đặt

1. Install dependencies:
```bash
npm install