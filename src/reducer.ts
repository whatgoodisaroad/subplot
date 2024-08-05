import { stat } from "fs";
import { ChoiceId, ChoiceOptionId, RuntimeState } from "./types/Story";

export type Update = {
  type: 'choice';
  choiceId: ChoiceId;
  selected: ChoiceOptionId;
}

export function reducer(state: RuntimeState, update: Update): RuntimeState {
  let sceneBeatIndex = state.sceneBeatIndex;
  let choiceLog = state.choiceLog;
  
  switch (update.type) {
    case 'choice':
      sceneBeatIndex = (state.sceneBeatIndex ?? 0) + 1;
      choiceLog = [
        ...state.choiceLog,
        {
          scene: state.currentScene,
          choiceId: update.choiceId,
          selected: update.selected,
         },
      ];
  }

  return {
    ...state,
    sceneBeatIndex,
    choiceLog,
  };
}