import { GENERATE } from '../../constants/ActionTypes';

export function generate(prompt, context = [], params = {}) {
  return {
    type: GENERATE,
    request: {
      op: 'post',
      path: '/@generate',
      data: {
        prompt,
        context,
        params,
      },
    },
  };
}
