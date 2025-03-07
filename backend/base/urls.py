from django.urls import path
from . import views

urlpatterns = [
    path('movies/', views.getMovies, name="movies"),
    path('movies/<int:pk>/', views.getMovie, name="movie"),
    path('movies/<int:id>/video/', views.movie_video, name='movie-video'),
]
