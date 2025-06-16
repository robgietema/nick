import { CHAT } from '../../constants/ActionTypes';

export function chat(prompt, messages = [], params = {}) {
  return {
    type: CHAT,
    request: {
      op: 'post',
      path: '/@chat',
      data: {
        prompt,
        messages,
        params,
      },
    },
  };
}
