import { useThemeStore } from '@/shared/store/theme.store';
import { useEffect } from 'react'

const ThemeInitializer = () => {
    const initializeTheme = useThemeStore((s) => s.initializeTheme);

    useEffect(() => {
        initializeTheme();
    }, [initializeTheme]);

    return (
        null
    )
}

export default ThemeInitializer