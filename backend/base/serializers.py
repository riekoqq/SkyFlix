from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken

class SubtitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtitle
        fields = ['language', 'subtitle_file']

class MovieSerializer(serializers.ModelSerializer):
    subtitles = SubtitleSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField(read_only=True)
    email = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['_id', 'email', 'role', 'isAdmin']

    def get__id(self, obj):
        return obj.id
    
    def get_email(self, obj):
        return obj.email

    def get_isAdmin(self, obj):
        return obj.is_staff
    
    def get_role(self, obj):
        return obj.role


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', '_id', 'email', 'role', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)