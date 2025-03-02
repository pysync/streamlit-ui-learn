from sqlmodel import SQLModel, Field

class UserCreate(SQLModel):
    name: str
    email: str
    age: int | None = None
    
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str
    age: int | None = None  # Có thể để trống (nullable)
    
from sqlmodel import create_engine

DATABASE_URL = "sqlite:///database.db"
engine = create_engine(DATABASE_URL)

# Tạo bảng trong CSDL
SQLModel.metadata.create_all(engine)

from sqlmodel import Session

# Thêm người dùng mới
def add_user():
    with Session(engine) as session:
        user = User(name="John Doe", email="johndoe@example.com", age=30)
        session.add(user)
        session.commit()  # Lưu thay đổi vào CSDL
        session.refresh(user)  # Cập nhật lại đối tượng với ID từ CSDL
        print("User added:", user)

add_user()


from sqlmodel import select

def get_users():
    with Session(engine) as session:
        statement = select(User)
        results = session.exec(statement)
        users = results.all()
        for user in users:
            print(user)

get_users()


def update_user(user_id: int, new_age: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if user:
            user.age = new_age
            session.add(user)
            session.commit()
            session.refresh(user)
            print("Updated user:", user)

update_user(1, 35)  # Cập nhật tuổi của user có ID=1
get_users()

def delete_user(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if user:
            session.delete(user)
            session.commit()
            print("Deleted user:", user_id)

delete_user(1)  # Xóa user có ID=1
get_users()