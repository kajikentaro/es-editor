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
