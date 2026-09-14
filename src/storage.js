import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'mi-dinero:state:v1';

export async function loadState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('No se pudo leer el almacenamiento', e);
  }
  return { profile: null, expenses: [], goals: [] };
}

export async function saveState(state) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('No se pudo guardar el almacenamiento', e);
  }
}
