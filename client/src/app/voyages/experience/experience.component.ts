import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {
  showQuestionnaire: boolean = false;
  currentStep = 1;

  startQuestionnaire() {
    this.showQuestionnaire = true;
  }

  // Gestione degli step del questionario
  stepsMng(direction: string) {
    if (direction === 'next') {
      this.currentStep++;
    } else if (direction === 'prev') {
      this.currentStep--;
    }
  }

  selectOption(event: Event) {
    const target = event.target as HTMLElement;
    const options = target.parentElement?.querySelectorAll('button');
    options?.forEach(btn => btn.classList.remove('selected'));
    target.classList.add('selected');
  }

  // TODO Al finish del questionario implementare una funzione che salva le preferenze dell'utente
  finish() {
    alert('Le tue preferenze sono state salvate!');
  }
}
