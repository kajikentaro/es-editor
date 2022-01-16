import cryptoRandomString from "crypto-random-string";

export const genRandomId = () => {
  const randomId = cryptoRandomString({
    length: 10,
    type: "url-safe",
  });
  return randomId;
};
