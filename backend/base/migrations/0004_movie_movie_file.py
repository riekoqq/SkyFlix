# Generated by Django 5.1.5 on 2025-03-04 16:16

import base.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_alter_movie_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='movie_file',
            field=models.FileField(blank=True, null=True, upload_to=base.models.upload_image_path),
        ),
    ]
