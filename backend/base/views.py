from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Movie, CustomUser
from .serializers import MovieSerializer, UserSerializer
from django.http import FileResponse, StreamingHttpResponse, HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from .serializers import *
from rest_framework import status
import os
from rest_framework_simplejwt.tokens import AccessToken
from django.http import JsonResponse

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        # Extract access token
        access_token = serializer.validated_data.get('access')

        # Set the access token in HttpOnly cookie
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax',  # Adjust if needed (e.g., 'Strict' or 'None' for cross-site)
            max_age=60 * 60 * 24 * 30  # Optional: 30 days expiration
        )

        return response

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

def authenticate_request(request):
    # Check Authorization header first
    auth_header = request.headers.get('Authorization', None)
    token_str = None

    if auth_header and auth_header.startswith('Bearer '):
        token_str = auth_header.split(' ')[1]
    else:
        # Fallback: Check access_token cookie
        token_str = request.COOKIES.get('access_token', None)

    if not token_str:
        return None

    try:
        token = AccessToken(token_str)
        user_id = token['user_id']
        user = CustomUser.objects.get(id=user_id)
        return user
    except Exception as e:
        print(f"Authentication error: {e}")
        return None

@api_view(['GET'])
def movie_video(request, id):
    user = authenticate_request(request)
    if not user or user.role.lower() not in ['premium', 'admin']:
        return HttpResponse("Forbidden: Upgrade to premium", status=403)

    # Proceed with video streaming
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
                    chunk_size = min(8192, remaining)
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

def getUsers(request):
    users = CustomUser.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_movies(request):
    query = request.GET.get('q', '')  # Get the search query from URL params
    if query:
        movies = Movie.objects.filter(title__icontains=query)  # Case-insensitive search
        results = [
            {
                "id": movie._id,
                "title": movie.title,
                "description": movie.description,
                "image": movie.image.url if movie.image else None,
            }
            for movie in movies
        ]
        return Response(results)  # Returns a JSON response with matching movies
    return Response([])  # Returns an empty array if no query is provided