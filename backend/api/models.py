from django.db import models
from django.contrib.auth.models import User


class BlogPost(models.Model):
    title = models.CharField(
        max_length=150, blank=False,
        verbose_name='title')
    slug = models.SlugField(
        max_length=50, blank=False,
        editable=False, verbose_name='slug')
    content = models.TextField(blank=False, verbose_name='content')
    created = models.DateTimeField(
        auto_now_add=True,  verbose_name='created')
    modified = models.DateTimeField(
        auto_now=True, verbose_name='modified')
    author = models.ForeignKey(
        to=User,
        to_field='username',
        related_name='posts',
        on_delete=models.CASCADE,
        verbose_name='author')

    class Meta:
        ordering = ['-modified']
        db_table = 'posts'

    def __str__(self):
        return self.title
