# Django imports
from django.utils.text import slugify

# Rest framework imports
from rest_framework.serializers import ModelSerializer

# Other
import random
import string

# Models
from ..models import BlogPost

RANDOM_SLUG_LENGTH = 6
RANDOM_SLUG_CHOICE = string.ascii_lowercase + string.digits


class BlogPostSerializer(ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content',
                  'created', 'modified', 'author', 'slug']

        extra_kwargs = {
            'created': {
                'format': "%d-%m-%Y %H:%M:%S"
            },
            'modified': {
                'format': "%d-%m-%Y %H:%M:%S"
            }
        }

    def _generate_random_slug_part(self):
        return ''.join(random.choice(RANDOM_SLUG_CHOICE) for _ in range(RANDOM_SLUG_LENGTH))

    def _generate_slug(self, title):
        max_length = BlogPost._meta.get_field(
            'slug').max_length - 1 - RANDOM_SLUG_LENGTH
        title_part = title[:max_length]
        while True:
            candidate_slug = slugify(
                f'{title_part}-{self._generate_random_slug_part()}')
            if not BlogPost.objects.filter(slug=candidate_slug).exists():
                break

        return candidate_slug

    def create(self, validated_data):
        slug = self._generate_slug(validated_data['title'])

        return BlogPost.objects.create(**validated_data, slug=slug)


class UpdateBlogPostSerializer(ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'content', 'slug']

    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)
        instance.save()

        return instance
