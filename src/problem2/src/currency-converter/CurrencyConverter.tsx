import { useEffect, useState } from "react";
import { Flex, Typography, Tooltip, Button } from "antd";
import { createUseStyles } from "react-jss";
import SwapOutlined from "@ant-design/icons/SwapOutlined";
import InfoCircleOutlined from "@ant-design/icons/InfoCircleOutlined";
import { IToken } from "../types";
import TokenService from "../service";
import CurrencyInput from "./CurrencyInput";

const { Title } = Typography;

const useStyles = createUseStyles({
  container: {
    textAlign: "center",
    maxWidth: 500,
    margin: "auto",
    padding: "0.2rem 3rem 1.5rem 1.5rem",
    background: "#f9f9f9",
    borderRadius: 10,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  swapIcon: {
    transform: "rotate(90deg)",
    fontSize: 22,
    margin: "1.5rem",
    "&:hover": {
      color: "#5d5d5d",
    },
  },
  rateInfo: {
    padding: "1.5rem 0rem",
    fontSize: "0.9rem",
  },
});

const CurrencyConverter = () => {
  const [fromValue, setFromValue] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("BUSD");
  const [isFromLoading, setFromLoading] = useState(false);
  const [toValue, setToValue] = useState(0);
  const [toCurrency, setToCurrency] = useState("ETH");
  const [isToLoading, setToLoading] = useState(false);
  const [rate, setRate] = useState(1);

  const [tokens, setTokens] = useState<IToken[]>([]);
  const [tokensMap, setTokensMap] = useState<{ [key: string]: IToken }>({});

  const classes = useStyles();

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
    setToLoading(true);
    const { result, rate } = await TokenService.convertCurrencyToken(
      newFromCurrency,
      toCurrency,
      value
    );
    setToLoading(false);
    setToValue(result);
    setRate(rate);
  };

  const onChangeToValue = async (value: number, newToCurrency = toCurrency) => {
    setToValue(value);
    setFromLoading(true);
    const { result, rate } = await TokenService.convertCurrencyToken(
      fromCurrency,
      newToCurrency,
      value
    );
    setFromLoading(false);
    setFromValue(result);
    setRate(rate);
  };

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

  useEffect(() => {
    fetchTokens();
    onChangeFromValue(fromValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        loading={isFromLoading}
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
        loading={isToLoading}
      />

      <Flex className={classes.rateInfo} align="center" justify="space-between">
        <Flex align="center" gap={3}>
          <span>Rate</span>
          <Tooltip title="Please note that this final conversion rate is subject to market conditions and may not match the spot price. The price can be refreshed.">
            <InfoCircleOutlined />
          </Tooltip>
        </Flex>
        <span>
          1 {fromCurrency} ≈ {rate} {toCurrency}
        </span>
      </Flex>

      <Button
        type="primary"
        loading={isFromLoading || isToLoading}
        onClick={() => onChangeFromValue(fromValue)}
      >
        Convert
      </Button>
    </div>
  );
};

export default CurrencyConverter;
