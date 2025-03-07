from django.db import models
import os
import random

def get_filename_ext(filepath):
    base_name = os.path.basename(filepath)
    name, ext = os.path.splitext(base_name)
    return name, ext

def upload_image_path(instance, filename):
    new_filename = random.randint(1, 2541781232)
    name, ext = get_filename_ext(filename)
    final_filename = '{new_filename}{ext}'.format(new_filename=new_filename, ext=ext)
    return "img/{new_filename}/{final_filename}".format(new_filename=new_filename, final_filename=final_filename)

class Movie(models.Model):
    title = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField()
    genre = models.CharField(max_length=200, null=True, blank=True)
    actors = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(upload_to=upload_image_path, null=True, blank=True)
    video = models.FileField(upload_to=upload_image_path, null=True, blank=True)
    _id = models.AutoField(primary_key=True)

    def __str__(self):
        return f"{self._id}. {self.title}"