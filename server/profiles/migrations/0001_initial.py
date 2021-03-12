# Generated by Django 3.1.7 on 2021-03-12 01:30
from django.db import migrations
from django.db import models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                (
                    'id', models.AutoField(
                        auto_created=True,
                        primary_key=True, serialize=False, verbose_name='ID',
                    ),
                ),
                ('name', models.CharField(max_length=100, verbose_name='name')),
                ('description', models.TextField(blank=True, null=True)),
                (
                    'createdAt', models.DateTimeField(
                        auto_now_add=True, verbose_name='Created At',
                    ),
                ),
            ],
        ),
    ]
