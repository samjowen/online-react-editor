import React from "react";

import Editor from "@monaco-editor/react";

const ExampleContext = React.createContext({
  menace: "ginger menace",
  wudjer: "rice",
});

export const ExampleContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const myValue = {
    menace: "ginger menace",
    wudjer: "rice",
  };

  return (
    <ExampleContext.Provider value={myValue}>
      {children}
    </ExampleContext.Provider>
  );
};

function transpileJSX(jsxCode) {
  return Babel.transform(jsxCode, {
    presets: ["react", "env"],
  });
}

const TranspiledComponent = ({ jsx }) => {
  const transpiledCode = transpileJSX(jsx);
  console.log(transpiledCode.code);
  try {
    eval(transpiledCode.code);
  } catch (e) {
    console.error(e);
  }

  const MyComponent = () => {
    eval(transpiledCode.code);
  };

  console.log(MyComponent);
  try {
    return (
      <ExampleContextProvider>
        <section className="bg-gray-100 p-4">
          {eval(transpiledCode.code)}
        </section>
      </ExampleContextProvider>
    );
  } catch (e) {
    console.error(e);
  }
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const App = () => {
  const [editorValue, setEditorValue] = React.useState("");
  const [key, setKey] = React.useState(0);

  const handleChange = (value: string) => {
    setEditorValue(value);
    setKey(key + 1);
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="w-1/2 bg-gray-200 p-4">
        <Editor
          height="90vh"
          defaultLanguage="typescript"
          defaultValue="// some comment"
          onChange={(value) => handleChange(value as string)}
        />
      </div>
      <div className="w-1/2 bg-gray-200 p-4" key={key}>
        <ErrorBoundary>
          <TranspiledComponent jsx={editorValue} />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
