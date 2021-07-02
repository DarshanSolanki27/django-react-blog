from django.contrib import admin

from .models import BlogPost

# To include post model to admin site
admin.site.register(BlogPost)
