# Generated by Django 5.1.3 on 2025-01-28 15:39

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('title', models.CharField(blank=True, max_length=200, null=True)),
                ('description', models.TextField()),
                ('genre', models.CharField(blank=True, max_length=200, null=True)),
                ('actors', models.CharField(blank=True, max_length=200, null=True)),
                ('image', models.URLField(blank=True, null=True)),
                ('_id', models.AutoField(primary_key=True, serialize=False)),
            ],
        ),
    ]
