import CryptoJS from "crypto-js";

const SECRET_KEY = "aslcryywt6964897324bcw9@7439&*0#jbkhv5"; // keep this secure

export const EncryptData = (key, data) => {
  const encryptData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY,
  ).toString();
  localStorage.setItem(key, encryptData);
};

export const DecryptData = (key) => {
  const cipherText = localStorage.getItem(key);
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};

export const RemoveData = async (key) => {
  localStorage.removeItem(key);
};
