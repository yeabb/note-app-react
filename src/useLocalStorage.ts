
export function useLocalStorage<T>(key: string, 
    initialValue: T | (() => T)) {
    const [value, setValue] = useState<T>(() => {
        const jsonValue = localStorage
    })
}