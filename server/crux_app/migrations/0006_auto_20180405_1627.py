# Generated by Django 2.0.3 on 2018-04-05 16:27

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('crux_app', '0005_dataset_uuid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dataset',
            name='uuid',
            field=models.UUIDField(default=uuid.UUID('571cf15b-271b-4d6b-8367-da60489c60b1'), editable=False, unique=True, verbose_name='UUID'),
        ),
    ]
