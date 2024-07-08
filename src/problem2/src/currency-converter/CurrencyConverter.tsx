import { useEffect, useState } from "react";
import { Typography } from "antd";
import { createUseStyles } from "react-jss";
import SwapOutlined from "@ant-design/icons/SwapOutlined";
import { IToken } from "../types";
import TokenService from "../service";
import CurrencyInput from "./CurrencyInput";

const { Title } = Typography;

const useStyles = createUseStyles({
  container: {
    maxWidth: 500,
    margin: "0 auto",
    marginTop: 100,
    padding: "0.2rem 3rem 1.5rem 1.5rem",
    background: "#f9f9f9",
    borderRadius: 10,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  swapIcon: {
    transform: "rotate(90deg)",
    fontSize: 22,
    margin: "1.5rem",
    "&:hover": {
      color: "#5d5d5d",
    },
  },
});

const CurrencyConverter = () => {
  const [fromValue, setFromValue] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("BUSD");
  const [toValue, setToValue] = useState(0);
  const [toCurrency, setToCurrency] = useState("ETH");

  const [tokens, setTokens] = useState<IToken[]>([]);
  const [tokensMap, setTokensMap] = useState<{ [key: string]: IToken }>({});

  const classes = useStyles();

  const fetchTokens = async () => {
    const tokens = await TokenService.getListTokens();
    setTokens(tokens);
    setTokensMap(
      tokens.reduce((map, token) => {
        map[token.currency] = token;
        return map;
      }, {} as { [key: string]: IToken })
    );
  };

  const swapConverter = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const onChangeFromValue = async (
    value: number,
    newFromCurrency = fromCurrency
  ) => {
    setFromValue(value);
    const toValue = await TokenService.convertCurrencyToken(
      newFromCurrency,
      toCurrency,
      value
    );
    setToValue(toValue);
  };

  const onChangeToValue = async (value: number, newToCurrency = toCurrency) => {
    setToValue(value);
    const fromValue = await TokenService.convertCurrencyToken(
      fromCurrency,
      newToCurrency,
      value
    );
    setFromValue(fromValue);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <div className={classes.container}>
      <Title level={2} style={{ textAlign: "center" }}>
        Currency Converter
      </Title>
      <CurrencyInput
        tokens={tokens.filter((token) => token.currency !== toCurrency)}
        tokensMap={tokensMap}
        title="From"
        currency={fromCurrency}
        setCurrency={(currency) => {
          setFromCurrency(currency);
          onChangeFromValue(fromValue, currency);
        }}
        value={fromValue}
        setValue={onChangeFromValue}
      />
      <SwapOutlined className={classes.swapIcon} onClick={swapConverter} />

      <CurrencyInput
        tokens={tokens.filter((token) => token.currency !== fromCurrency)}
        tokensMap={tokensMap}
        title="To"
        currency={toCurrency}
        setCurrency={(currency) => {
          setToCurrency(currency);
          onChangeToValue(toValue, currency);
        }}
        value={toValue}
        setValue={onChangeToValue}
      />
    </div>
  );
};

export default CurrencyConverter;
