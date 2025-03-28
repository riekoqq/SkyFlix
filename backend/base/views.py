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
from collections import Counter

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
def recently_added(request):
    movies = Movie.objects.all().order_by('-_id')[:6]
    serializer = MovieSerializer(movies, many=True)
    return Response({"movies": serializer.data})  # Wrap in "movies"

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

from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

@api_view(['GET'])
def movie_video(request, id):
    user = authenticate_request(request)
    if not user or user.role.lower() not in ['premium', 'admin']:
        return JsonResponse({"detail": "Forbidden: Upgrade to premium"}, status=403)

    # Fetch movie object
    movie = get_object_or_404(Movie, _id=id)
    
    if not movie.video:  # Ensure video exists
        return JsonResponse({"detail": "No video available"}, status=404)

    # Construct full S3 URL
    s3_base_url = "https://skyflix-bucket.s3.ap-southeast-2.amazonaws.com/"
    video_url = f"{s3_base_url}{movie.video}"

    return JsonResponse({"video_url": video_url})


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
        # Ensure all required fields are passed
        if not data.get('email') or not data.get('password'):
            return Response({'detail': 'Username, email, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the new user
        user = CustomUser.objects.create(
            email=data['email'],
            role=data.get('role', 'free'),  # Default role if not provided
            password=make_password(data['password'])  # Hash the password
        )

        serializer = UserSerializerWithToken(user, many=False)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        message = {'detail': str(e)}
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def log_watch_history(request):
    user = request.user
    movie_id = request.data.get('movie_id')

    if not movie_id:
        return Response({"error": "Movie ID is required"}, status=400)

    try:
        movie = Movie.objects.get(_id=movie_id)
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=404)

    # Create a new watch history entry
    watch_entry, created = UserWatchHistory.objects.get_or_create(user=user, movie=movie)

    return Response({"message": "Watch history logged successfully"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def top_picks(request):
    user = request.user

    watched_movies = UserWatchHistory.objects.filter(user=user).values_list('movie', flat=True)

    if not watched_movies:
        return Response({"movies": []})

    # Get all genres of watched movies
    genres = Genre.objects.filter(movie__in=watched_movies).values_list('name', flat=True)

    # Count the genres
    genre_counts = Counter(genres)
    top_genres = [genre for genre, _ in genre_counts.most_common(2)]

    # Get recommended movies that share the top genres
    recommended_movies = Movie.objects.filter(
        genre__name__in=top_genres
    ).exclude(
        _id__in=watched_movies
    ).distinct().order_by('-_id')[:6]

    serializer = MovieSerializer(recommended_movies, many=True)

    return Response({"movies": serializer.data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def watch_history(request):
    user = request.user
    watched_entries = UserWatchHistory.objects.filter(user=user).select_related('movie')
    movies = [entry.movie for entry in watched_entries]
    serializer = MovieSerializer(movies, many=True)
    return Response({"movies": serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_bookmark(request, movie_id):
    try:
        movie = Movie.objects.get(_id=movie_id)
        bookmark, created = Bookmark.objects.get_or_create(user=request.user, movie=movie)
        if created:
            return Response({'detail': 'Movie bookmarked'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Movie already bookmarked'}, status=status.HTTP_200_OK)
    except Movie.DoesNotExist:
        return Response({'detail': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_bookmark(request, movie_id):
    try:
        movie = Movie.objects.get(_id=movie_id)
        bookmark = Bookmark.objects.get(user=request.user, movie=movie)
        bookmark.delete()
        return Response({'detail': 'Bookmark removed'}, status=status.HTTP_200_OK)
    except (Movie.DoesNotExist, Bookmark.DoesNotExist):
        return Response({'detail': 'Bookmark not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bookmarks(request):
    bookmarks = Bookmark.objects.filter(user=request.user)
    serializer = BookmarkSerializer(bookmarks, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def subscribe(request):
    user = request.user
    user.role = 'premium'
    user.save()

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    response = Response({
        'detail': 'Subscription successful',
        'access': access_token,
        'refresh': str(refresh),  # Include refresh token
    }, status=status.HTTP_200_OK)

    response.set_cookie('access_token', access_token, httponly=True)
    return response
