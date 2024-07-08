import axios from "axios";
import { IToken } from "./types";

/**
 * Resolve duplication token issue
 */
const getLatestPriceTokens = (tokens: IToken[]): IToken[] => {
  // Sort by 'date' in descending order
  const sortTokens = tokens.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const markedCurrency: { [key: string]: boolean } = {};

  const returnTokens: IToken[] = [];

  sortTokens.forEach((token) => {
    if (markedCurrency[token.currency] !== true) {
      markedCurrency[token.currency] = true;
      returnTokens.push(token);
    }
  });
  return returnTokens;
};

const preloadImageByUrl = (url: string) => {
  try {
    const img = new Image();
    img.src = url;
  } catch (err) {
    console.error(err);
    console.log(`[Preload image] Can't load image: ${url}`);
  }
};

/**
 * Increase the request timeout duration
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const TokenService = {
  /**
   * Let's assume we have an API that retrieves all tokens with the properties 'currency', 'price', and 'logo'.
   */
  getListTokens: async (): Promise<IToken[]> => {
    const res = await axios.get("https://interview.switcheo.com/prices.json");
    return getLatestPriceTokens(res.data as IToken[]).map(
      ({ currency, price, date }: IToken) => {
        const logo = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`;
        preloadImageByUrl(logo);
        return {
          currency,
          price,
          date,
          logo,
        };
      }
    );
  },
  /**
   * Let's assume we have an API that converts values from 'from' to 'to' with an amount.
   * e.g: https://interview.switcheo.com/converter?from=USDT&to=BTC&amount=0.4
   */
  convertCurrencyToken: async (
    from: string,
    to: string,
    amount: number
  ): Promise<number> => {
    const res = await axios.get("https://interview.switcheo.com/prices.json");
    await delay(1000);
    // Create currency map
    const currencyMap: { [key: string]: number } = {};
    getLatestPriceTokens(res.data).forEach(
      ({ currency, price }: IToken) => (currencyMap[currency] = price)
    );

    return (currencyMap[from] / currencyMap[to]) * amount;
  },
};

export default TokenService;
