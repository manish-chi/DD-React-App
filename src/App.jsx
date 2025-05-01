import MinimizableWebChat from "./MinimizableWebChat";
import WebPageBackground from "./dd-background-new.jpg";
import { Route, Routes} from "react-router-dom";
import "./App.css";

const App = () => (
  <div className="App">
    <img alt="product background" src={WebPageBackground} />
    <MinimizableWebChat />
  </div>
);

export default App;
