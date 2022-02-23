export const setLocalStorage = (itemKey: string, value: any) => {
  const valueStr = JSON.stringify(value);
  window.localStorage.setItem(itemKey, valueStr);
};

export const getLocalStorage = (itemKey: string) => {
  const res = window.localStorage.getItem(itemKey);
  if (res) {
    return JSON.parse(res);
  } else {
    return [];
  }
};

export const getSessionStorage = (itemKey: string) => {
  if (typeof window === "undefined") return {};
  const res = window.sessionStorage.getItem(itemKey);
  if (res) {
    return JSON.parse(res);
  } else {
    return {};
  }
};

export const setSessionStorage = (itemKey: string, value: any) => {
  if (typeof window === "undefined") return;
  const valueStr = JSON.stringify(value);
  window.sessionStorage.setItem(itemKey, valueStr);
};
