import { useEffect, useRef } from 'react'

/**
 * A custom hook that sets up an interval that calls a function at a specified delay.
 * This implementation is safer than a plain `setInterval` inside a component because it
 * uses a ref to store the callback, which prevents issues with stale closures.
 * @param callback The function to be called at each interval.
 * @param delay The interval delay in milliseconds. If null, the interval is cleared.
 */
export function useSetInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>()

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current()
            }
        }
        if (delay !== null) {
            const id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}
