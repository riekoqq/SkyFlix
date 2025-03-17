from django.urls import path
from . import views

urlpatterns = [
    path('movies/', views.getMovies, name="movies"),
    path('movies/<int:pk>/', views.getMovie, name="movie"),
    path('movies/<int:id>/video/', views.movie_video, name='movie-video'),
    path('users/login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register', views.registerUser, name='register'),
    path('users/profile', views.getUserProfile, name='user-profile'),
    path('users/', views.getUsers, name='users'),
]
