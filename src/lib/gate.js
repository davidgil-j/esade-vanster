// La portada espera a que la pantalla de carga se levante (o a nada, si no la hay).
let release;
export const heroGate = typeof window !== 'undefined' ? new Promise((r) => { release = r; }) : null;
export const openHeroGate = () => release?.();
