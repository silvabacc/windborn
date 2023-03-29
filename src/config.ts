interface Config {
  RAPID_SAVE_URL: string;
}

const getConfig = (): Config => ({
  RAPID_SAVE_URL: 'https://sd.rapidsave.com/download.php',
});

export default getConfig;
