# Generated by Django 5.0.6 on 2024-07-02 18:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('parks', '0003_alter_resources_doc_upload'),
    ]

    operations = [
        migrations.AddField(
            model_name='lesson',
            name='npid',
            field=models.CharField(default='npid', max_length=100),
        ),
    ]