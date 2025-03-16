from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Movie, CustomUser
from .serializers import MovieSerializer, UserSerializer
from django.http import FileResponse, StreamingHttpResponse, HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.hashers import make_password
from .serializers import *
from rest_framework import status
import os


@api_view(['GET'])
def getMovies(request):
    movies = Movie.objects.all()
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getMovie(request, pk):
    movie = get_object_or_404(Movie, _id=pk)
    serializer = MovieSerializer(movie, many=False)
    return Response(serializer.data)

from django.http import StreamingHttpResponse, HttpResponse, FileResponse
from django.shortcuts import get_object_or_404
import os

def movie_video(request, id):
    movie = get_object_or_404(Movie, _id=id)
    if not movie.video:
        return HttpResponse("No video available", status=404)

    video_path = movie.video.path
    file_size = os.path.getsize(video_path)
    range_header = request.headers.get('Range', None)

    if range_header:
        start = 0
        end = file_size - 1

        try:
            range_value = range_header.strip().split('=')[1]
            range_parts = range_value.split('-')
            if range_parts[0]:
                start = int(range_parts[0])
            if len(range_parts) > 1 and range_parts[1]:
                end = int(range_parts[1])
            if start >= file_size:
                return HttpResponse("Requested Range Not Satisfiable", status=416)
        except (ValueError, IndexError):
            return HttpResponse("Invalid Range Header", status=400)

        content_length = (end - start) + 1

        def stream():
            with open(video_path, 'rb') as video_file:
                video_file.seek(start)
                remaining = content_length
                while remaining > 0:
                    chunk_size = 8192 if remaining >= 8192 else remaining
                    data = video_file.read(chunk_size)
                    if not data:
                        break
                    remaining -= len(data)
                    yield data

        response = StreamingHttpResponse(stream(), status=206, content_type='video/mp4')
        response['Content-Length'] = str(content_length)
        response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
        response['Accept-Ranges'] = 'bytes'
        response['Cache-Control'] = 'no-store'
        return response

    # No Range header, serve the full file
    return FileResponse(open(video_path, 'rb'), content_type='video/mp4')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = CustomUser.objects.create(
            username=data['username'],
            email=data['email'],
            password=make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer