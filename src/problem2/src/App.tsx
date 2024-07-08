import { createUseStyles } from "react-jss";
import CurrencySwapForm from "./currency-converter";

const useStyles = createUseStyles({
  container: {
    background: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
    backgroundSize: "400% 400%",
    animation: "$gradient 15s ease infinite",
    height: "100vh",
    width: "100vw",
    position: "relative",
  },
  "@keyframes gradient": {
    "0%": {
      backgroundPosition: "0% 50%",
    },
    "50%": {
      backgroundPosition: "100% 50%",
    },
    "100%": {
      backgroundPosition: "0% 50%",
    },
  },
});

function App() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <CurrencySwapForm />
    </div>
  );
}

export default App;
