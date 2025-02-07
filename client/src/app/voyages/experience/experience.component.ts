import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {
  logOff: boolean = false;
  showQuestionnaire: boolean = false; 
  currentStep = 1;

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  isLinear = false;

  startQuestionnaire() {
    this.showQuestionnaire = true;
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  selectOption(event: Event) {
    const target = event.target as HTMLElement;
    const options = target.parentElement?.querySelectorAll('button');
    options?.forEach(btn => btn.classList.remove('selected'));
    target.classList.add('selected');
  }

  finish() {
    alert('Le tue preferenze sono state salvate!');
  }
}
