import React from "react";
import { BrowserRouter as Router, Route, Link,Routes } from "react-router-dom";
import NewPost from "./components/NewPost";
import Navbar from "./components/Navbar";

export default function App(props) {

  return (
    <Router>
      <Routes>
        <Route path="/home" caseSensitive={false} element={<NewPost />} />
        <Route path="/result" caseSensitive={false} element={<Navbar expression = {props.expressions} />} />
      </Routes>
      <button id= "hide"><Link id= "hide" to="/home">Component</Link></button>
    </Router>
    
  );
}
