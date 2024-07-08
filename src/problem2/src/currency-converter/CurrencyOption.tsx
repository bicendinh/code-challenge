import { Flex, Image } from "antd";
import { IToken } from "../types";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  selectCurrencyInput: {
    width: 100,
  },
  selectCurrencyLabel: {
    fontWeight: 600,
  },
});

const CurrencyOption: React.FC<IToken> = ({ logo, currency }) => {
  const classes = useStyles();
  return (
    <Flex gap={3} align="center" className={classes.selectCurrencyInput}>
      <Image
        preview={false}
        src={logo}
        alt={currency}
        fallback="https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/USD.svg"
      />
      <span className={classes.selectCurrencyLabel}>{currency}</span>
    </Flex>
  );
};

export default CurrencyOption;
