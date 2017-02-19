# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-08-04 13:32
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('common', '0001_initial'),
        ('players', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated', models.DateTimeField(blank=True, editable=False, null=True)),
                ('name', models.CharField(max_length=255)),
                ('available_positions', models.ManyToManyField(blank=True, related_name='teams', to='common.Position')),
                ('captain', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='teams_captain_of', to='players.Player')),
                ('creator', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='teams_created', to='players.Player')),
                ('players', models.ManyToManyField(related_name='teams', through='common.TeamMember', to='players.Player')),
                ('regions', models.ManyToManyField(blank=True, related_name='teams', to='common.Region')),
                ('skill_bracket', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='common.SkillBracket')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]