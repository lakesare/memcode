import t from './actionTypes';
import { State } from './model';

const initialState: State = [{
  text: 'Use Redux',
  completed: false,
  id: 0
}];

export (state = initialState, action: any): State => {
  switch (action.type) {
    case t.ADD:
      return [
        // ...
      ];
    // ...
  }
};