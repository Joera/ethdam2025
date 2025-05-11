import { writable } from 'svelte/store';

export function localStorageStore(key: string, initialValue: string) {

    if (typeof window !== 'undefined') {
        
        const storedValue = localStorage.getItem(key);

        console.log("storedValue", storedValue);

        let data;
        if (storedValue === null) {
            data = typeof initialValue !== 'string' ? JSON.parse(initialValue) : initialValue;
        } else {
            data = JSON.parse(storedValue);
        }

        // Convert back to Map if it's the circles store
        if (key === 'circlesStore' && data) {
            data = new Map(Object.entries(data));
        }
        
        const store = writable(data);
        store.subscribe(value => {
            let valueToStore = value;
            
            // Convert Map to object for storage
            if (key === 'circlesStore' && value instanceof Map) {
                valueToStore = Object.fromEntries(value);
            }

            localStorage.setItem(key, JSON.stringify(valueToStore));
        });

        return store;
    } else {
        return writable(initialValue);
    }
}
