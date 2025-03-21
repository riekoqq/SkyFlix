# Generated by Django 5.1.5 on 2025-03-20 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_userwatchhistory'),
    ]

    operations = [
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=200, null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='movie',
            name='genre',
        ),
        migrations.AddField(
            model_name='movie',
            name='genre',
            field=models.ManyToManyField(blank=True, null=True, to='base.genre'),
        ),
    ]
