# Create forms from models.

from django import forms
from .models import Lesson

# Create a Lesson ModelForm.
class CreateLessonForm(forms.ModelForm):
    # Specify the name of the model to use.
    class Meta:
        model = Lesson
        fields = '__all__'
        # Hide fields and style Django forms with built-in widgets.
        # Disable fields
        widgets = {
            # 'id': forms.HiddenInput(),
            # 'url': forms.HiddenInput(),        
            # 'title': forms.Textarea(attrs={'class': 'form-control'}),
            # 'parks': forms.JSONField(),
            # 'questionObjective': forms.Textarea(attrs={'class': 'form-control'}),
            # 'gradeLevel': forms.Textarea(attrs={'class': 'form-control'}),
            # 'commonCore': forms.JSONField(),
            # 'subject': forms.JSONField(),
            # 'duration': forms.Textarea(attrs={'class': 'form-control'}),
            # 'notes': forms.Textarea(attrs={'class': 'form-control'}),
            # 'image': forms.ImageField(),
            # 'doc_upload': forms.FileField(),
            # 'user': forms.HiddenInput(),
            # 'date': forms.HiddenInput(),
        }