from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

class SubtitleSerializer(serializers.ModelSerializer):
    subtitle_file = serializers.SerializerMethodField()

    def get_subtitle_file(self, obj):
        if obj.subtitle_file:
            return f"{settings.MEDIA_URL}{obj.subtitle_file.name}"  # ✅ Ensure MEDIA_URL is applied
        return None

    class Meta:
        model = Subtitle
        fields = ['language', 'subtitle_file']

class MovieSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField(read_only=True)
    video_url = serializers.SerializerMethodField(read_only=True)
    subtitles = SubtitleSerializer(many=True, read_only=True)  # ✅ Keep `many=True`

    def get_image_url(self, obj):
        if obj.image:
            return f"{settings.MEDIA_URL}{obj.image.name}"  # ✅ Use `.name`
        return None
    
    def get_video_url(self, obj):
        if obj.video:
            return f"{settings.MEDIA_URL}{obj.video.name}"  # ✅ Use `.name`
        return None
    
    def get_subtitles(self, obj):
        obj.subtitles = Subtitle.objects.filter(movie=obj)
        return SubtitleSerializer(obj.subtitles.all(), many=True).data

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

class BookmarkSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)

    class Meta:
        model = Bookmark
        fields = '__all__'
