export type SceneId = string;
export type ChoiceId = string;
export type ChoiceOptionId = string;

export type ChoiceOption = {
  body: string;
  id: ChoiceOptionId;
  actions?: ActionSet;
};

export type Choice = {
  type: 'choice';
  id: ChoiceId;
  body?: string;
  options: ChoiceOption[];
};

export type Action = 
  | { type: 'go-to-scene'; sceneId: SceneId }
  | { type: 'set-stat', statName: string; value: string }
  | { type: 'update-stat', statName: string; value: string };

export type ActionSet = {
  type: 'action-set';
  actions: Action[];
};

export type Beat = {
  body: string;
  conclusion?: Choice | ActionSet;
};

export type Scene = {
  id: SceneId;
  beats: Beat[];
};

type BaseStat = { name: string };

type IntegerStat = BaseStat & { type: 'integer', initialValue: number };
type RealStat = BaseStat & { type: 'real', initialValue: number };
type EnumerationStat = BaseStat & {
  type: 'enumeration';
  values: string[];
  initialValue: string;
}

export type Stat = IntegerStat | RealStat | EnumerationStat;

export type Story = {
  stats?: Stat[];
  scenes: Scene[];
  startScene: SceneId;
};

type RuntimeIntegerStat = IntegerStat & { value: number };
type RuntimeRealStat = RealStat & { value: number };
type RuntimeEnumerationStat = EnumerationStat & { value: string };

export type RuntimeStat = RuntimeIntegerStat | RuntimeRealStat | RuntimeEnumerationStat;

export type ChoiceLogEntry = {
  scene: SceneId;
  choiceId: ChoiceId;
  selected: ChoiceOptionId;
};

export type RuntimeState = {
  story: Story;
  stats: RuntimeStat[];
  currentScene: SceneId;
  sceneBeatIndex?: number;
  choiceLog: ChoiceLogEntry[];
};
