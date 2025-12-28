import {Injectable, signal, WritableSignal} from '@angular/core';
import {Formation} from '../interfaces/formation';

@Injectable({
  providedIn: 'root',
})
export class FormationSelectionStateService {
    private selectedFormation :WritableSignal<Formation|null> =signal(null)

    setSelectedFormation(formation : Formation| null):void{
      this.selectedFormation.set(formation)
    }
    getCurrentFormation():Formation | null {
      return this.selectedFormation();
    }
}
