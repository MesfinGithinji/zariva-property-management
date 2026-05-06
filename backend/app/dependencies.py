from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User, UserRole

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == int(user_id), User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def require_landlord(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.landlord:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Landlord access required")
    return current_user


def require_tenant(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.tenant:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tenant access required")
    return current_user
