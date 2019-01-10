from django.shortcuts import get_object_or_404, render, redirect
from django.views.decorators.http import require_GET, require_POST
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseServerError
from django.template import loader
from .models import Question


# Create your views here.


def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    context = {'latest_question_list': latest_question_list}
    return render(request, 'polls/index.html', context)
	
def detail(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    return render(request, 'polls/detail.html', {'question': question})

def results(request, question_id):
	question = get_object_or_404(Question, pk=question_id)
	#return render(request, 'polls/results.html', {'question': question})
	return redirect(question.get_absolute_url())
	
@require_POST
def vote(request, question_id):
	question = get_object_or_404(Question, pk=question_id)
	selected_choice = question.choice_set.get(pk=request.POST['selectionId'])
	selected_choice.votes += 1
	selected_choice.save()
	#return render(request, 'polls/results.html', {'question': question})
	return redirect('polls:results', question_id = question_id)
