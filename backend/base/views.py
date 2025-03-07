from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Movie
from .serializers import MovieSerializer
from django.http import FileResponse, JsonResponse, StreamingHttpResponse, HttpResponse
from django.shortcuts import get_object_or_404
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

def movie_video(request, id):
    """
    Stream video files with support for range requests.
    """
    movie = get_object_or_404(Movie, _id=id)

    if not movie.video:
        return HttpResponse("No video available", status=404)

    video_path = movie.video.path
    file_size = os.path.getsize(video_path)

    # Handle range headers for streaming support
    range_header = request.headers.get('Range', None)
    if range_header:
        try:
            range_value = range_header.strip().split('=')[1]
            range_start, range_end = range_value.split('-')

            range_start = int(range_start) if range_start else 0
            range_end = int(range_end) if range_end else file_size - 1

            if range_start >= file_size:
                return HttpResponse("Requested Range Not Satisfiable", status=416)

            content_length = (range_end - range_start) + 1

            response = StreamingHttpResponse(
                open(video_path, 'rb'),
                status=206,  # Partial Content
                content_type='video/mp4'
            )
            response['Content-Length'] = str(content_length)
            response['Content-Range'] = f'bytes {range_start}-{range_end}/{file_size}'
            response['Accept-Ranges'] = 'bytes'
            response['Cache-Control'] = 'no-store'  # Ensure no caching issues

            return response
        except ValueError:
            return HttpResponse("Invalid Range Header", status=400)

    return FileResponse(open(video_path, 'rb'), content_type='video/mp4')
