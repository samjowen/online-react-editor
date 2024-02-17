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
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 p-8">
          <h1 className="mb-4 text-2xl font-semibold text-red-500">
            Oops! Something went wrong.
          </h1>
          <p className="mb-6 text-lg text-gray-700">
            We're sorry for the inconvenience. Please try refreshing the page or
            fixing the syntax of your code.
          </p>
        </div>
      );
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
    <div className="flex h-screen w-screen p-1 rounded-lg shadow-lg gap-4 py-3 px-4">
      <div className="w-1/2 bg-gray-200 p-6 rounded-xl ">
        <Editor
          height="90vh"
          defaultLanguage="javascript"
          defaultValue="const [count, setCount] = React.useState(0);
          const {menace, wudjer} = React.useContext(ExampleContext);
          <>
          <h1 className='bg-green-500'>{count}</h1>
          <button onClick={() => setCount(count + 1)}> Click me! </button>
          <h1> {menace} </h1>
          </>"
          onChange={(value) => handleChange(value as string)}
        />
      </div>
      <div className="w-1/2 bg-gray-200 p-4 rounded-xl" key={key}>
        <ErrorBoundary>
          <TranspiledComponent jsx={editorValue} />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
