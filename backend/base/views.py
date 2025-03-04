from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Movie
from .serializers import MovieSerializer

@api_view(['GET'])
def getMovies(request):
    movies = Movie.objects.all()
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getMovie(request, pk):
    movie = Movie.objects.get(_id=pk)
    serializer = MovieSerializer(movie, many=False)
    return Response(serializer.data)