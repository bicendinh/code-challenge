/** @description
 *         1. Code block below is the refactored version of the code.
 *         2. Please check 'Wallet.tsx's comments. They point out the computational inefficiencies and anti-patterns.
 */

interface WalletBalance {
  currency: string;
  blockchain: string;
  amount: number;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
  formatted: string;
}

const getPriority = (blockchain: any): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const filteredBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      return balancePriority > -99 && balance.amount > 0;
    });
  }, [balances]);

  const sortedBalances = useMemo(() => {
    return filteredBalances.sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority;
    });
  }, [filteredBalances]);

  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed(),
    }));
  }, [sortedBalances]);

  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.blockchain}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );
  return <div {...rest}>{rows}</div>;
};
