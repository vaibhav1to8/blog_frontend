import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.scss";
import App from "./App";

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Unexpected UI error." };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5">
          <div className="alert alert-danger">
            Frontend failed to render: {this.state.message}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000/",
  }),
  cache: new InMemoryCache(),
});

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Missing root element with id 'app'.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </RootErrorBoundary>
  </React.StrictMode>
);
