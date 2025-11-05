import { isWebTest, usedInClient } from './misc'
import type { TGelEnv } from './type'

export const getCurrentEnv = (isDev: boolean): TGelEnv => {
  let env: TGelEnv = 'terminal'

  if (usedInClient()) {
    env = 'terminal'
  } else if (/pc\.front/i.test(window.location.href?.toLocaleLowerCase())) {
    env = 'terminalWeb'
  } else if (isWebTest()) {
    env = 'webTest'
  } else if (isDev) {
    env = 'local'
  } else {
    env = 'web'
  }

  return env
}
