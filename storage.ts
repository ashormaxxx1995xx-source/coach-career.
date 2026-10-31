import { GameState } from '../types/game';

const STORAGE_KEY = 'coach_career_save_v1';

export function saveGameState(state: GameState): boolean {
  try {
    if (typeof window !== 'undefined') {
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    }
  } catch (err) {
    console.error('Failed to save game state to localStorage:', err);
  }
  return false;
}

export function loadGameState(): GameState | null {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data) as GameState;
      }
    }
  } catch (err) {
    console.error('Failed to load game state:', err);
  }
  return null;
}

export function clearGameState(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to clear game state:', err);
  }
}

export function exportSaveFile(state: GameState): void {
  try {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CoachCareer_${state.myClub.name}_S${state.currentSeason}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (e) {
    console.error('Export failed', e);
  }
}
