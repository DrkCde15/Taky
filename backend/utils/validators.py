import re

def validate_password_strength(password: str) -> tuple[bool, str]:
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-+]", password):
        return False, "Password must contain at least one special character"
    return True, ""

def sanitize_filename(filename: str) -> str:
    import re
    name, ext = filename.rsplit(".", 1) if "." in filename else (filename, "")
    name = re.sub(r"[^a-zA-Z0-9_-]", "_", name)
    name = name[:64]
    return f"{name}.{ext}" if ext else name
