frontend/
├── app.py                 # File chính chạy Streamlit, quản lý điều hướng trang
├── components/            # Các component chung: hàm gọi API, helper, … 
│   └── api_client.py      # Các hàm gọi API backend
├── pages/                 # Các trang của ứng dụng
│   ├── artifacts.py       # Trang quản lý tài liệu: hiển thị danh sách, thêm mới, …
│   └── chat.py            # Trang giao diện chat với AI
└── requirements.txt       # Danh sách thư viện cần thiết cho Streamlit