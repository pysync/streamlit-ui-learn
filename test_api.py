from fastapi import FastAPI, Depends

from test_db import User,UserCreate,  engine, select, Session

app = FastAPI()

# Dependency để lấy session
def get_session():
    with Session(engine) as session:
        yield session

@app.post("/users/", response_model=User)
def create_user(user: UserCreate, session: Session = Depends(get_session)):
    db_user = User(**user.dict())
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@app.get("/users/", response_model=list[User])
def read_users(session: Session = Depends(get_session)):
    statement = select(User)
    users = session.exec(statement).all()
    return users