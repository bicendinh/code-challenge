/**
 * @description
 *       1. Please check the comments below. They point out the computational inefficiencies and anti-patterns..
 *       2. 'FixedWallet.tsx' is the refactored version of the code.
 */

interface WalletBalance {
  currency: string;
  amount: number;
  /**
   * @description Missing declaration of the 'blockchain' property.
   */
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  /**
   * @description
   *        1. 'blockchain' variable needs to be declared clearly.
   *        2. Should move the 'getPriority' function outside of the component to avoid recreating it multiple times.
   * @example blockchain: any -> blockchain: string
   */
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

  /**
   * @description Separate this 'useMemo' into two 'useMemo' hooks: one for sorting and one for filtering.
   *              -> It can improve readability and enhance performance.
   */
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        /**
         * @description
         *   1. 'lhsPriority' might be a typo. Replace to 'balancePriority'
         *   2. Code with too many if-else statements looks complicated
         * @example Replace below code to "return balancePriority > -99 && balance.amount > 0;"
         */
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        /**
         * @description Code with too many if-else statements looks complicated
         * @example Replace below code to "return rightPriority - leftPriority;"
         */
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
    /**
     * @description This 'useMemo' does not depend on the 'prices' variable. Remove the 'prices' variable from the dependency
     */
  }, [balances, prices]);

  /**
   * @description Use 'useMemo' with the dependency being the 'sortedBalances' variable.
   *
   */
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  /**
   * @description Use 'formattedBalances' variable instead of 'sortedBalances' variable
   */
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          /**
           * @description Using the 'index' variable as the key for the component is not a good practice.
           * This can cause the component to re-render multiple times even when the data hasn't changed significantly.
           * A better approach is to use a unique and meaningful identifier like the 'blockchain' property (assuming it's unique).
           */
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
