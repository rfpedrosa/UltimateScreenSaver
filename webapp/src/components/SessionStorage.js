 const SessionStorage = {
  loadStorageState: (key) => {
    try {
      const serializedState = sessionStorage.getItem(key);

      if(serializedState === null) {
        return undefined;
      }

      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  },
  setStorageState: (key, state) => {
    try {
      const serializedState = JSON.stringify(state);
      sessionStorage.setItem(key, serializedState);
    }
    catch (err) {
      // Ignore write errors.
    }
  },
  removeStorageState: (key) => {
    try {
      sessionStorage.removeItem(key)
    }
    catch(err) {
      // Ignore write errors.
    }
  },
  getStorageKey: (component, userId) => {
    return `${component}-${userId}`;
  },

}

export default SessionStorage;
