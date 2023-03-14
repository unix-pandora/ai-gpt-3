import React from "react";
import Tackle from "@/components/tackle/Tackle";
document.title = "React App";

class App extends React.Component {
  render() {
    return (
      <div className="AppDiv">
        <Tackle />
      </div>
    );
  }
}

export default App;
