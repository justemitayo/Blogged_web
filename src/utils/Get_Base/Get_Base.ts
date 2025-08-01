export const getBase64FromURL = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) resolve(reader.result.toString());
      else reject('Failed to convert to base64');
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
