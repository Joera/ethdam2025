import Dispatcher from '.pnpm/undici-types@6.19.8/node_modules/undici-types/dispatcher'
import RetryHandler from '.pnpm/undici-types@6.19.8/node_modules/undici-types/retry-handler'

export default RetryAgent

declare class RetryAgent extends Dispatcher {
  constructor(dispatcher: Dispatcher, options?: RetryHandler.RetryOptions)
}
