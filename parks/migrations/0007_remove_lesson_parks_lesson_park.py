# Generated by Django 5.0.6 on 2024-07-09 16:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('parks', '0006_lesson_hasresources'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lesson',
            name='parks',
        ),
        migrations.AddField(
            model_name='lesson',
            name='park',
            field=models.CharField(default='', max_length=10),
        ),
    ]