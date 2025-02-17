import { Event, Callback, CallbackList } from './event';
import { Disposable } from './disposable';
import { MaybePromise } from './prioritizeable';

export interface EmitterOptions {
    onFirstListenerAdd?: Function;
    onLastListenerRemove?: Function;
}

export class Emitter<T = any> {

    private static LEAK_WARNING_THRESHHOLD = 175;

    private static _noop = function (): void { };

    private _event: Event<T>;
    protected _callbacks: CallbackList | undefined;
    private _disposed = false;

    private _leakingStacks: Map<string, number> | undefined;
    private _leakWarnCountdown = 0;

    constructor(
        private _options?: EmitterOptions
    ) { }

    /**
     * For the public to allow to subscribe
     * to events from this Emitter
     */
    get event(): Event<T> {
        if (!this._event) {
            this._event = Object.assign((listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]) => {
                if (!this._callbacks) {
                    this._callbacks = new CallbackList();
                }
                if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) {
                    this._options.onFirstListenerAdd(this);
                }
                this._callbacks.add(listener, thisArgs);
                const removeMaxListenersCheck = this.checkMaxListeners(this._event.maxListeners);

                const result: Disposable = {
                    dispose: () => {
                        if (removeMaxListenersCheck) {
                            removeMaxListenersCheck();
                        }
                        result.dispose = Emitter._noop;
                        if (!this._disposed) {
                            this._callbacks!.remove(listener, thisArgs);
                            result.dispose = Emitter._noop;
                            if (this._options && this._options.onLastListenerRemove && this._callbacks!.isEmpty()) {
                                this._options.onLastListenerRemove(this);
                            }
                        }
                    }
                };
                if (Array.isArray(disposables)) {
                    disposables.push(result);
                }

                return result;
            }, {
                maxListeners: Emitter.LEAK_WARNING_THRESHHOLD
            }
            );
        }
        return this._event;
    }

    protected checkMaxListeners(maxListeners: number): (() => void) | undefined {
        if (maxListeners === 0 || !this._callbacks) {
            return undefined;
        }
        const listenerCount = this._callbacks.length;
        if (listenerCount <= maxListeners) {
            return undefined;
        }

        const popStack = this.pushLeakingStack();

        this._leakWarnCountdown -= 1;
        if (this._leakWarnCountdown <= 0) {
            // only warn on first exceed and then every time the limit
            // is exceeded by 50% again
            this._leakWarnCountdown = maxListeners * 0.5;

            let topStack: string;
            let topCount = 0;
            this._leakingStacks!.forEach((stackCount, stack) => {
                if (!topStack || topCount < stackCount) {
                    topStack = stack;
                    topCount = stackCount;
                }
            });

            // eslint-disable-next-line max-len
            console.warn(`Possible Emitter memory leak detected. ${listenerCount} listeners added. Use event.maxListeners to increase the limit (${maxListeners}). MOST frequent listener (${topCount}):`);
            console.warn(topStack!);
        }

        return popStack;
    }

    protected pushLeakingStack(): () => void {
        if (!this._leakingStacks) {
            this._leakingStacks = new Map();
        }
        const stack = new Error().stack!.split('\n').slice(3).join('\n');
        const count = (this._leakingStacks.get(stack) || 0);
        this._leakingStacks.set(stack, count + 1);
        return () => this.popLeakingStack(stack);
    }

    protected popLeakingStack(stack: string): void {
        if (!this._leakingStacks) {
            return;
        }
        const count = (this._leakingStacks.get(stack) || 0);
        this._leakingStacks.set(stack, count - 1);
    }

    /**
     * To be kept private to fire an event to
     * subscribers
     */
    fire(event: T): any {
        if (this._callbacks) {
            this._callbacks.invoke(event);
        }
    }

    /**
     * Process each listener one by one.
     * Return `false` to stop iterating over the listeners, `true` to continue.
     */
    async sequence(processor: (listener: (e: T) => any) => MaybePromise<boolean>): Promise<void> {
        if (this._callbacks) {
            for (const listener of this._callbacks) {
                if (!await processor(listener)) {
                    break;
                }
            }
        }
    }

    dispose(): void {
        if (this._leakingStacks) {
            this._leakingStacks.clear();
            this._leakingStacks = undefined;
        }
        if (this._callbacks) {
            this._callbacks.dispose();
            this._callbacks = undefined;
        }
        this._disposed = true;
    }
}

export interface WaitUntilEvent {
    /**
     * Allows to pause the event loop until the provided thenable resolved.
     *
     * *Note:* It can only be called during event dispatch and not in an asynchronous manner
     *
     * @param thenable A thenable that delays execution.
     */
    waitUntil(thenable: Promise<any>): void;
}
export namespace WaitUntilEvent {
    /**
     * Fire all listeners in the same tick.
     *
     * Use `AsyncEmitter.fire` to fire listeners async one after another.
     */
    export async function fire<T extends WaitUntilEvent>(
        emitter: Emitter<T>,
        event: Omit<T, 'waitUntil'>,
        timeout: number | undefined = undefined
    ): Promise<void> {
        const waitables: Promise<void>[] = [];
        const asyncEvent = Object.assign(event, {
            waitUntil: (thenable: Promise<any>) => {
                if (Object.isFrozen(waitables)) {
                    throw new Error('waitUntil cannot be called asynchronously.');
                }
                waitables.push(thenable);
            }
        }) as T;
        try {
            emitter.fire(asyncEvent);
            // Asynchronous calls to `waitUntil` should fail.
            Object.freeze(waitables);
        } finally {
            delete (asyncEvent as any)['waitUntil'];
        }
        if (!waitables.length) {
            return;
        }
        if (timeout !== undefined) {
            await Promise.race([Promise.all(waitables), new Promise(resolve => setTimeout(resolve, timeout))]);
        } else {
            await Promise.all(waitables);
        }
    }
}

import { CancellationToken } from './cancellation';

export class AsyncEmitter<T extends WaitUntilEvent> extends Emitter<T> {

    protected deliveryQueue: Promise<void> | undefined;

    /**
     * Fire listeners async one after another.
     */
    fire(event: Omit<T, 'waitUntil'>, token: CancellationToken = CancellationToken.None,
        promiseJoin?: (p: Promise<any>, listener: Function) => Promise<any>): Promise<void> {
        const callbacks = this._callbacks;
        if (!callbacks) {
            return Promise.resolve();
        }
        const listeners = [...callbacks];
        if (this.deliveryQueue) {
            return this.deliveryQueue = this.deliveryQueue.then(() => this.deliver(listeners, event, token, promiseJoin));
        }
        return this.deliveryQueue = this.deliver(listeners, event, token, promiseJoin);
    }

    protected async deliver(listeners: Callback[], event: Omit<T, 'waitUntil'>, token: CancellationToken,
        promiseJoin?: (p: Promise<any>, listener: Function) => Promise<any>): Promise<void> {
        for (const listener of listeners) {
            if (token.isCancellationRequested) {
                return;
            }
            const waitables: Promise<void>[] = [];
            const asyncEvent = Object.assign(event, {
                waitUntil: (thenable: Promise<any>) => {
                    if (Object.isFrozen(waitables)) {
                        throw new Error('waitUntil cannot be called asynchronously.');
                    }
                    if (promiseJoin) {
                        thenable = promiseJoin(thenable, listener);
                    }
                    waitables.push(thenable);
                }
            }) as T;
            try {
                listener(event);
                // Asynchronous calls to `waitUntil` should fail.
                Object.freeze(waitables);
            } catch (e) {
                console.error(e);
            } finally {
                delete (asyncEvent as any)['waitUntil'];
            }
            if (!waitables.length) {
                return;
            }
            try {
                await Promise.all(waitables);
            } catch (e) {
                console.error(e);
            }
        }
    }

}
