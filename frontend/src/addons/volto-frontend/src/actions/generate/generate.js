import { GENERATE } from '../../constants/ActionTypes';

export function generate(prompt, context = '') {
  return {
    type: GENERATE,
    request: {
      op: 'post',
      path: '/@generate',
      data: {
        prompt,
        context,
      },
    },
  };
}
