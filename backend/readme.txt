models/: Chứa các định nghĩa dữ liệu (ví dụ, Artifact, User, …).
routers/: Chứa các endpoint API, mỗi file tương ứng với một module nghiệp vụ.
services/: Chứa logic nghiệp vụ (CRUD, xử lý AI, tính toán,…).
vectorstore/: Tích hợp với LlamaIndex và các hệ thống vector store (ChromaDB, Redis DocumentStore…) cùng các hàm update index, tạo embedding.
dependencies.py & config.py: Giúp tách biệt cấu hình và dependency injection (ví dụ, tạo session cho database, load biến môi trường,…).