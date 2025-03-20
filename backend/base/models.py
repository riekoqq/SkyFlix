from django.db import models
import os
import random
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

def get_filename_ext(filepath):
    base_name = os.path.basename(filepath)
    name, ext = os.path.splitext(base_name)
    return name, ext

def upload_image_path(instance, filename):
    new_filename = random.randint(1, 2541781232)
    name, ext = get_filename_ext(filename)
    final_filename = '{new_filename}{ext}'.format(new_filename=new_filename, ext=ext)
    return "img/{new_filename}/{final_filename}".format(new_filename=new_filename, final_filename=final_filename)

ROLE_CHOICES = [
    ('admin', 'Admin'),
    ('staff', 'Staff'),
    ('premium', 'Premium'),
    ('free', 'Free'),
]

class CustomUserManager(BaseUserManager):
    def create_user(self, email, role='customer', password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password=password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='free')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) 

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.email}"
class Genre(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    genre = models.ManyToManyField(Genre)
    actors = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(upload_to=upload_image_path, null=True, blank=True)
    video = models.FileField(upload_to=upload_image_path, null=True, blank=True)
    restricted = models.BooleanField(default=True)
    _id = models.AutoField(primary_key=True)

    def __str__(self):
        return f"{self._id}. {self.title}"
    
class UserWatchHistory(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    watched_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} watched {self.movie} at {self.watched_at}"
    
class Subtitle(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='subtitles')
    language = models.CharField(max_length=50)
    subtitle_file = models.FileField(upload_to='subtitles/')

    def __str__(self):
        return f"Subtitle for {self.movie.title} ({self.language})"

class Bookmark(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookmarks')
    movie = models.ForeignKey('Movie', on_delete=models.CASCADE, related_name='bookmarked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')

    def __str__(self):
        return f"{self.user.email} bookmarked {self.movie.title}"
