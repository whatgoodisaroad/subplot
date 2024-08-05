import { ChoiceId, ChoiceOptionId } from "./Story";

export type ChoiceViewModel =
  | { type: 'proceed' }
  | {
    type: 'open-choice';
    choiceId: ChoiceId;
    options: {
      label: string;
      id: ChoiceOptionId;
    }[];
  };

export type BeatViewModel = {
  body: string;
  choice: ChoiceViewModel;
};
