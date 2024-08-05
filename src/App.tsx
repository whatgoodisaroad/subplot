import React, { useReducer, useState } from 'react';
import './App.css';
import { RuntimeState, Story } from './types/Story';
import { BeatViewModel, ChoiceViewModel } from './types/ViewModels';
import { reducer, Update } from './reducer';
import Markdown from 'react-markdown'

function getInitialState(story: Story): RuntimeState {
  return {
    story,
    stats: [],
    currentScene: story.startScene,
    choiceLog: [],
  };
};

function App(): JSX.Element {
  const story: Story = {
    startScene: 'scene1',
    scenes: [
      {
        id: 'scene1',
        beats: [
          {
            body: `
A kelp farm is a place of routine. Located in the remote north,
your farm specializes in the production of low-light cultivars
able to withstand the long months of polar night. Most of the time
you are the only person out here, a [man|woman|person] running a
small farm by yourself. 

However, the lack of human company doesn't mean you're alone. A
large aqua-cultural company you contract with has developed a
strain of psychic sea-slugs, tiny helpers who can keep your coral
healthy and pest-free.

Feeding them is your first chore of the day. Depending on what
kind of feed you purchase for their diet, they can develop into
different strains.

(Your current funds to keep the farm running are 50, and as a new
farmer your reputation in the market is low.)
            `,
            conclusion: {
              type: 'choice',
              id: 'firstChoice',
              body: `
                You've been feeding your sea slugs:
              `,
              options: [
                { body: 'Poisonous jellyfish shipped in specially.', id: 'doThing' },
                { body: 'Small sea snails from local suppliers.', id: 'takeSword' },
                { body: 'Normal kelp from the farm.', id: 'xyz' },
              ],
            },
          },
          {
            body: 'zomg',
            conclusion: { type: 'action-set', actions: [{ type: 'go-to-scene', sceneId: 'scene2' }] } 
          },
        ]
      },
      {
        id: 'scene2',
        beats: [
          {
            body: 'End',
            conclusion: {
              type: 'action-set',
              actions: [],
            },
          }
        ]
      }
    ],
  };

  const [state, dispatch] = useReducer(reducer, getInitialState(story));

  return (
    <div className="App">
      <Scene runtime={state} dispatch={dispatch} />
    </div>
  );
}

function Scene({ runtime, dispatch }: {
  runtime: RuntimeState;
  dispatch: React.Dispatch<Update>;
}): JSX.Element {
  const scene = runtime.story.scenes.find(({ id }) => id === runtime.currentScene);
  if (!scene) {
    return <h1>Something went wrong: can't find scene: {runtime.currentScene}</h1>;  
  }

  const beats: BeatViewModel[] = scene.beats
    .slice(0, (runtime.sceneBeatIndex ?? 0) + 1)
    .map((beat): BeatViewModel => {
      const choice: ChoiceViewModel = !beat.conclusion
        ? { type: 'proceed' }
        : beat.conclusion.type === 'choice'
        ? {
           type: 'open-choice',
           choiceId: beat.conclusion.id,
           options: beat.conclusion.options.map(option => ({
            label: option.body,
            id: option.id,
          })),
          } 
        : { type: 'proceed' };
      return { body: beat.body, choice };
    });

  return <div>

    {beats.map((vm) => <Beat viewModel={vm} dispatch={dispatch} />)}
  </div>;
}

function Beat({ viewModel, dispatch }: {
  viewModel: BeatViewModel;
  dispatch: React.Dispatch<Update>;
}): JSX.Element {
  return <div>
    <Markdown>{viewModel.body}</Markdown>
    {viewModel.choice.type === 'proceed' && <button>Proceed</button>}
    {viewModel.choice.type === 'open-choice' && <div>
      {viewModel.choice.options.map((option) => <button onClick={() => {
        if (viewModel.choice.type === 'open-choice') {
          dispatch({
            type: 'choice',
            choiceId: viewModel.choice.choiceId,
            selected: option.id,
          });
        }
      }}>{option.label}</button>)}
    </div>}
  </div>;
}

export default App;
