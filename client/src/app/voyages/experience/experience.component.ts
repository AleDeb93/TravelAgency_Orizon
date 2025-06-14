import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ContentObserver } from '@angular/cdk/observers';


@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {
  showQuestionnaire: boolean = false;
  showResults: boolean = false;
  currentStep = 1;
  userPreferences: string[] = [];
  destinations: any[] = [];

  constructor(private apiService: ApiService) { }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // CARICAMENTO DELLE PREFEREZZE DELL'UTENTE SE PRESENTI
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  async ngOnInit(): Promise<void> {
    console.log('Sono nel onInit di ExperienceComponent');
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    const user = await this.apiService.getUser(localUser.id).toPromise();

    if (user && user.preferences) {
      console.log('Preferenze caricate:', user.preferences);
      this.userPreferences = [
        user.preferences.activity || '',
        user.preferences.theme || '',
        user.preferences.location || '',
        user.preferences.discounted ? 'Sì' : 'No'
      ];

      await this.finish();
    } else {
      this.showQuestionnaire = true;
    }
  }



  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // LOGICA DEL QUESTIONARIO
  //-------------------------------------------------------------------------------------------------------------------------------------------------

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

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // FUNZIONI PER LA GESTIONE DEL RISULTATO
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  async finish() {
    const [activity, theme, location, discountedRaw] = this.userPreferences;
    const discounted = discountedRaw === 'Sì';

    try {
      const destinations = await this.apiService.getDestinationsByPreferences({
        activity,
        theme,
        location,
        discounted
      }).toPromise();

      this.destinations = destinations;
      this.showQuestionnaire = false;
      this.showResults = true;
      // Ottengo l'utente corrente dal localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      // Aggiorno le preferenze dell'utente
      const updatedUser = {
        ...user,
        preferences: {
          activity,
          theme,
          location,
          discounted
        }
      };
      // Chiamo updateUser per salvare le preferenze
      await this.apiService.updateUser(updatedUser).toPromise();
      window['Swal'].fire({
        text: `Trovate ${destinations.length} destinazioni in base alle tue preferenze!`,
        icon: 'success',
        showConfirmButton: true,
      });
    } catch (err) {
      console.error('Errore nella chiamata:', err);

      window['Swal'].fire({
        text: 'Nessuna destinazione trovata o errore nel server.',
        icon: 'error',
        showConfirmButton: true,
      });
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // RIMOZIONE DEI RISULTATI
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  async clearPreferences() {
    this.showResults = false;
    this.destinations = [];
    this.userPreferences = [];
    this.currentStep = 1;

    // Recupera l'utente dal localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Aggiorna l'utente con preferenze vuote
    const updatedUser = {
      ...user,
      preferences: null
      // {
      //   activity: '',
      //   theme: '',
      //   location: '',
      //   discounted: false
      // }
    };

    try {

      await this.apiService.updateUser(updatedUser).toPromise();
      console.log(updatedUser);
      // Opzionalmente aggiorna anche il localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      window['Swal'].fire({
        text: 'Preferenze rimosse.',
        icon: 'success',
        showConfirmButton: true,
      });
    } catch (error) {
      console.error('Errore durante il salvataggio delle preferenze rimosse:', error);
      window['Swal'].fire({
        text: 'Errore durante la rimozione delle preferenze.',
        icon: 'error',
        showConfirmButton: true,
      });
    }
  }


}
