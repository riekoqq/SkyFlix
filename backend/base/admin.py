from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Movie)
admin.site.register(CustomUser)
admin.site.register(UserWatchHistory)
admin.site.register(Genre)
admin.site.register(Subtitle)