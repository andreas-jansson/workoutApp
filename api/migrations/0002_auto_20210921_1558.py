# Generated by Django 3.1.5 on 2021-09-21 15:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='ExerciseType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.CharField(max_length=75, unique=True),
        ),
        migrations.CreateModel(
            name='Workout',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=100)),
                ('active', models.BooleanField(default=True)),
                ('shared', models.BooleanField(default=True)),
                ('consistsOf', models.ManyToManyField(blank=True, to='api.Exercise')),
            ],
        ),
        migrations.CreateModel(
            name='scheduledWorkout',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('scheduledDate', models.DateTimeField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.user')),
                ('workout', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.workout')),
            ],
        ),
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sets', models.IntegerField()),
                ('reps', models.IntegerField()),
                ('weight', models.IntegerField()),
                ('time', models.TimeField()),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.exercise')),
                ('scheduledWorkout', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.scheduledworkout')),
            ],
        ),
        migrations.AddField(
            model_name='exercise',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.exercisetype'),
        ),
        migrations.AddField(
            model_name='user',
            name='hasWorkouts',
            field=models.ManyToManyField(blank=True, to='api.Workout'),
        ),
        migrations.AlterField(
            model_name='user',
            name='roleid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.role'),
        ),
    ]