from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat_messages', '0002_mensaje_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='archivo',
            name='mensaje',
            field=models.ForeignKey(
                blank=True, null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='archivos',
                to='chat_messages.mensaje',
            ),
        ),
    ]
