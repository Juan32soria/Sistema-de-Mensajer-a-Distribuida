from rest_framework_simplejwt.authentication import JWTAuthentication


class TokenUser:
    """User-like object built from JWT payload — no local DB lookup needed."""
    is_authenticated = True
    is_active = True

    def __init__(self, payload):
        self.id = payload.get('user_id')
        self.username = payload.get('username', '')

    def __str__(self):
        return str(self.username)


class RemoteJWTAuthentication(JWTAuthentication):
    """Validates JWT signature only; skips local user DB lookup."""

    def get_user(self, validated_token):
        return TokenUser(validated_token)
