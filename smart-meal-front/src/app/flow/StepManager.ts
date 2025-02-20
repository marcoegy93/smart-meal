export class StepManager {

  private currentStep: string;

  private nextSteps: { [key: string]: string } = {
    'ITEM': 'sections',
    'SECTION': 'done'
  };

  private previousSteps: { [key: string]: string } = {
    'SECTION': 'items'
  };

  constructor(currentStep: string) {
    this.currentStep = currentStep;
  }

  public getCurrentStep(){
    return this.currentStep
  }

  public updateCurrentStep(currentStep: string) {
    this.currentStep = currentStep;
  }

  public getNextStep(): string {
    return this.nextSteps[this.currentStep] || '';
  }

  public getPreviousStep(): string {
    return this.previousSteps[this.currentStep] || '';
  }
}
