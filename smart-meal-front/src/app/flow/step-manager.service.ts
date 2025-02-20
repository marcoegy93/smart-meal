import { Injectable } from '@angular/core';
import {BehaviorSubject, firstValueFrom} from "rxjs";
import { Item } from 'src/domain/model/Item';

@Injectable({
  providedIn: 'root'
})
export class StepManagerService {

  public currentStep: BehaviorSubject<string> =  new BehaviorSubject('ITEM');
  public done: boolean = false;


  private nextSteps: { [key: string]: string } = {
    'ITEM': 'sections',
    'SECTION': 'summary',
    'SUMMARY': 'done'
  };

  private nextStepsSimple: { [key: string]: string } = {
    'ITEM': 'summary',
    'SUMMARY': 'done'
  };

  private previousSteps: { [key: string]: string } = {
    'SECTION': 'items',
    'SUMMARY': 'sections'
  };

  private previousStepsSimple: { [key: string]: string } = {
    'SUMMARY': 'items'
  };

  private stepCompletionStatusCompound: { [key: string]: boolean } = {
    'ITEM': false,
    'SECTION': false,
    'SUMMARY': false
  };

  private stepCompletionStatusSimple: { [key: string]: boolean } = {
    'ITEM': false,
    'SUMMARY': false
  };

  private stepMapping: { [key: string]: string } = {
    'summary': 'SUMMARY',
    'items': 'ITEM',
    'sections': 'SECTION'
  };

  private stepsArrayCompound: string[] = ['ITEM', 'SECTION', 'SUMMARY'];
  private stepsArraySimple: string[] = ['ITEM', 'SUMMARY'];

  constructor() {
  }

  public formCompleted() {
    this.done = true;
  }

  public getCurrentStep(){
    return this.currentStep
  }

  public updateCurrentStep(currentStep: string) {
    this.currentStep.next(currentStep);
  }

  async getNextStep(type: string) {
    const step = await firstValueFrom(this.currentStep);
    console.log(type)

    if(type === 'COMPOUND'){
      return this.nextSteps[step] || '';
    }
    return this.nextStepsSimple[step] || '';
  }

  async getPreviousStep(type: string) {
    const step = await firstValueFrom(this.currentStep);
    console.log(step)
    console.log(type)
    if(type === 'COMPOUND'){
      return this.previousSteps[step] || '';
    }
    return this.previousStepsSimple[step] || '';
  }

 public canNavigateToStep(type: string, targetStep: string): boolean {
    const step = this.currentStep.getValue();
    const stepsArray = type === 'COMPOUND' ? this.stepsArrayCompound : this.stepsArraySimple;
    const stepCompletionStatus = type === 'COMPOUND' ? this.stepCompletionStatusCompound : this.stepCompletionStatusSimple;

    // Normaliser la targetStep via le mappage
    targetStep = this.stepMapping[targetStep.toLowerCase()] || targetStep;

    const currentIndex = stepsArray.indexOf(step);
    const targetIndex = stepsArray.indexOf(targetStep);

    if (targetIndex === -1) {
        return false; // Étape cible non valide
    }

    if (targetIndex > currentIndex) {
        // Vérifier les étapes intermédiaires pour aller de l'avant
        for (let i = currentIndex; i < targetIndex; i++) {
            if (!stepCompletionStatus[stepsArray[i]]) {
                return false; // Une étape précédente n'est pas complétée
            }
        }
    } else if (targetIndex < currentIndex) {
        // Revenir à une étape précédente est toujours permis
        return true;
    }

    return true; // Étape atteignable
}


  public completeStep(step: string, type: string): void {
    if (type === 'COMPOUND') {
        this.stepCompletionStatusCompound[step] = true;
    } else {
        this.stepCompletionStatusSimple[step] = true;
    }
  }

  public resetSteps(type: string): void {
    if (type === 'COMPOUND') {
        this.stepCompletionStatusCompound = {
            'ITEM': false,
            'SECTION': false,
            'SUMMARY': false
        };
    } else {
        this.stepCompletionStatusSimple = {
            'ITEM': false,
            'SUMMARY': false
        };
    }
  }

  public getStepByIndex(index: number, type: string): string {
    if (type === 'COMPOUND') {
        return this.stepsArrayCompound[index];
    }
    return this.stepsArraySimple[index];
  }
}
