import { Flex, Input, Select } from "antd";
import { ChangeEvent, useState } from "react";
import { createUseStyles } from "react-jss";
import CurrencyOption from "./CurrencyOption";
import classNames from "classnames";
import Paragraph from "antd/es/typography/Paragraph";
import { IToken } from "../types";

const useStyles = createUseStyles({
  container: {
    maxWidth: 500,
    margin: "0 auto",
    padding: "2rem",
    background: "#f9f9f9",
    borderRadius: 10,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  tokenIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  inputWrap: {
    borderRadius: 12,
    cursor: "pointer",
    padding: 16,
    position: "relative",
    width: "100%",
    "&:before": {
      border: "1px solid #c1c1c1",
      borderRadius: 12,
      bottom: 0,
      content: '""',
      left: 0,
      pointerEvents: "none",
      position: "absolute",
      right: 0,
      top: 0,
    },
    "&.focusedInput": {
      "&:before": {
        border: "2px solid #f0b90b",
      },
    },
  },
  inputHeader: {
    marginBottom: 16,
    textAlign: "left",
    fontSize: 16,
  },
  inputBox: {
    flex: "1 1",
    marginRight: 33,
    overflow: "hidden",
  },
  estimateAmount: {
    textWrap: "nowrap",
    color: "var(--ant-color-info)",
    overflow: "hidden",
    pointerEvents: "none",
    width: "100%",
    textAlign: "left",
  },
  inputValue: {
    backgroundColor: "transparent",
    borderStyle: "hidden",
    color: "var(--ant-color-primary-text)",
    fontSize: 20,
    fontWeight: 500,
    height: 28,
    lineHeight: 28,
    outline: "none !important",
    width: "100%",
    boxShadow: "none !important",
    padding: "0 !important",
    "&:focus,&:hover": {
      background: "none",
    },
  },
});

interface CurrencyInputProps {
  setValue: (value: number) => void;
  value: number;
  currency: string;
  setCurrency: (currency: string) => void;
  tokens: IToken[];
  tokensMap: { [key: string]: IToken };
  title: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  setValue,
  value,
  currency,
  setCurrency,
  tokens,
  tokensMap,
  title,
}) => {
  const classes = useStyles();
  const [isFocused, setFocused] = useState(false);

  return (
    <div
      className={classNames(classes.inputWrap, {
        focusedInput: isFocused,
      })}
    >
      <Paragraph className={classes.inputHeader}>{title}</Paragraph>
      <Flex justify="space-between">
        <Flex vertical className={classes.inputBox}>
          <Flex>
            <Input
              className={classes.inputValue}
              value={value}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const value = Number.parseFloat(event.currentTarget.value);
                if (isNaN(value)) return setValue(0);
                setValue(value);
              }}
              onBlur={() => setFocused(false)}
              onFocus={() => setFocused(true)}
            />
          </Flex>
          <Flex>
            <Paragraph className={classes.estimateAmount}>
              ≈ ${(tokensMap[currency]?.price ?? 1) * value}
            </Paragraph>
          </Flex>
        </Flex>
        <Flex>
          <Select
            value={currency}
            showSearch
            options={tokens.map((token) => ({
              value: token.currency,
              label: <CurrencyOption {...token} />,
            }))}
            onChange={setCurrency}
            onBlur={() => setFocused(false)}
            onFocus={() => setFocused(true)}
          />
        </Flex>
      </Flex>
    </div>
  );
};

export default CurrencyInput;
