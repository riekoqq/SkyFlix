from rest_framework import serializers
from .models import Movie

class MovieSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = ['_id', 'title', 'video_url', 'image', 'description', 'actors', 'genre']

    def get_video_url(self, obj):
        # Return the full URL to the video
        return obj.video.url if obj.video else None
