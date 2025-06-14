import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {
  showQuestionnaire: boolean = false;
  currentStep = 1;
  userPreferences: string[] = [];

  constructor(private apiService: ApiService) { }


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
    console.log(`[${new Date().toLocaleString()}] Hai selezionato: ${target.textContent}`);
    this.userPreferences[this.currentStep - 1] = target.textContent ?? '';
  }

  // TODO Al finish del questionario implementare una funzione che salva le preferenze dell'utente
  finish() {
    const [activity, theme, location, discountedRaw] = this.userPreferences;
    const discounted = discountedRaw === 'Si';

    this.apiService.getDestinationsByPreferences({
      activity,
      theme,
      location,
      discounted
    }).subscribe({
      next: (destinations: any) => {
        console.log('Destinazioni trovate:', destinations);

        window['Swal'].fire({
          text: `Trovate ${destinations.length} destinazioni in base alle tue preferenze!`,
          icon: 'success',
          showConfirmButton: true,
        });

        // Qui salvare i dati o navigare a una pagina con i risultati
      },
      error: (err: any) => {
        console.error('Errore nella chiamata:', err);

        window['Swal'].fire({
          text: 'Nessuna destinazione trovata o errore nel server.',
          icon: 'error',
          showConfirmButton: true,
        });
      }
    });
  }
}
