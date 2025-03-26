from django.urls import path
from . import views

urlpatterns = [
    path('movies/top-picks/', views.top_picks, name='top-picks'),
    path('movies/recently-added/', views.recently_added, name='recently-added'),
    path('movies/<int:pk>/', views.getMovie, name="movie"),
    path('movies/<int:id>/video/', views.movie_video, name='movie-video'),
    path('users/login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register', views.registerUser, name='register'),
    path('users/profile', views.getUserProfile, name='user-profile'),
    path('users/', views.getUsers, name='users'),
    path('movies/search/', views.search_movies, name='search-movies'),
    path('movies/log-watch-history/', views.log_watch_history, name='log-watch-history'),
    path('movies/watch-history/', views.watch_history, name='watch-history'),
    path('bookmark/<int:movie_id>/add/', views.add_bookmark, name='add-bookmark'),
    path('bookmark/<int:movie_id>/remove/', views.remove_bookmark, name='remove-bookmark'),
    path('bookmark/', views.get_bookmarks, name='get-bookmarks'),
    path('subscribe/', views.subscribe, name='subscribe'),
]
