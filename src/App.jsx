import "./App.css";
// import { TextField } from '@mui/material';
import { Button, Form } from "react-bootstrap";
// import Bgimage from '../public/background_image.jpg'
// import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import UploadFile from "@mui/icons-material/Upload";
import DownloadFile from "@mui/icons-material/Download";
import CopyAllFile from "@mui/icons-material/CopyAll";
import { useRef, useState } from "react";
import { Route, Switch } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import CodeEditor from "./components/CodeEditor";
import axios from "axios";
import { Skeleton } from "@mui/material";

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
// const Promt_String =
//   "Your are an excellent software developer. You will be give a swagger yaml file with one api information an you have to create a test plan for it with atleast 4 testcases and write the code for each testcase in the test plan using python . Make sure all test cases are at the end of response wrraped under ''' '''.The swagger file is as following ";


const Promt_String = "Your are an excellent software developer. You will be give a swagger yaml file with one api information an you have to create a test plan for it with atleast 4 testcases and write the code for each testcase in the test plan using python, wrapp all the code with ''' .The swagger file is as following "
function App() {
  // async function onSubmit(event) {
  //   event.preventDefault();
  //   try {
  //     const response = await fetch("/api/generate", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ animal: 'tiger' }),
  //     });

  //     const data = await response.json();
  //     if (response.status !== 200) {
  //       throw data.error || new Error(`Request failed with status ${response.status}`);
  //     }
  //     console.log("Hell Result", data.result)
  //     // setResult(data.result);
  //     // setAnimalInput("");
  //   } catch(error) {
  //     // Consider implementing your own error handling logic here
  //     console.error(error);
  //     alert(error.message);
  //   }
  // }
  const [inputText, setInputText] = useState("");
  const [isHome, setIsHome] = useState(true);
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const APIBody = {
      model: "text-davinci-003",
      prompt: `${Promt_String} \n ${inputText} \n `,
      temperature: 0,
      max_tokens: 2500,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      // stop: ["!"],
    };
    console.log("requestbody: ", APIBody);

    try {
      // const response =await fetch("https://api.openai.com/v1/completions", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + API_KEY,
      //   },
      //   body: JSON.stringify(APIBody),
      // })
      setIsLoading(true);
      setIsHome(false);
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        JSON.stringify(APIBody),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + API_KEY,
          },
        }
      );
      // setIsHome(false);
      console.log("Data: ", response.data);
      setData(response.data.choices[0].text);
      // return response;
    } catch (err) {
      console.log("## error while calling openai api: ", err);
    }
    setIsLoading(false);
    //     curl https://api.openai.com/v1/completions \
    //   -H "Content-Type: application/json" \
    //   -H "Authorization: Bearer $OPENAI_API_KEY" \
    //   -d '{
    //   "model": "text-davinci-003",
    //   "prompt": "I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with \"Unknown\".\n\nQ: What is human life expectancy in the United States?\nA: Human life expectancy in the United States is 78 years.\n\nQ: Who was president of the United States in 1955?\nA: Dwight D. Eisenhower was president of the United States in 1955.\n\nQ: Which party did he belong to?\nA: He belonged to the Republican Party.\n\nQ: What is the square root of banana?\nA: Unknown\n\nQ: How does a telescope work?\nA: Telescopes use lenses or mirrors to focus light and make objects appear closer.\n\nQ: Where were the 1992 Olympics held?\nA: The 1992 Olympics were held in Barcelona, Spain.\n\nQ: How many squigs are in a bonk?\nA: Unknown\n\nQ: Where is the Valley of Kings?\nA:",
    //   "temperature": 0,
    //   "max_tokens": 100,
    //   "top_p": 1,
    //   "frequency_penalty": 0.0,
    //   "presence_penalty": 0.0,
    //   "stop": ["\n"]
    // }'
  };
  return (
    <div className="App">
      {/* <Switch>
            <Route exact path="/home">
              <LogsPage />
            </Route>
            <Route exact path="/result">
              <TabBar />
            </Route>
            <Route exact path="/applications">
              <ApplicationsPage />
            </Route>
            <Route path="/models">
              <ModelsPage />
            </Route>

            <Route path="/">
              <Redirect to="/models" />
            </Route>
          </Switch> */}
      <header className="App-Container">
        <div className="container">
          {isHome ? (
            <>
              <h1>Generate Test plan and Test Code for APIs</h1>
              <h5>using Test With GPT</h5>

              <p className="mt-5">Upload or enter the swagger file</p>

              {/* <DeleteIcon color="blue"/> */}
              <div className="row mt-3 d-flex justify-content-center">
                <div className="col-6" style={{ position: "relative" }}>
                  <Form.Control
                    className=""
                    as="textarea"
                    rows={10}
                    value={inputText}
                    onChange={(e, v) => setInputText(v)}
                  />
                  <UploadButton setInputText={(e) => setInputText(e)} />
                </div>
                {/* <div className="col-6">
          
            </div> */}
                <div className="col-12 mt-3">
                  <Button onClick={onSubmit}>
                    Generate Test Plan & Test Code
                  </Button>
                </div>
              </div>
            </>
          ) : isLoading ? (
            <LoadingScreen />
          ) : (
            <Result response={data} setIsHome={setIsHome} />
          )}
        </div>
      </header>
    </div>
  );
}

export default App;

const UploadButton = ({ setInputText }) => {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState(null);
  const handleFileSelect = (e) => {
    const name = e.target.value.split(`\\`);
    const file = e.target.files[0];
    setFileName(e.target.value);
    setName(name[name.length - 1]);
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setInputText(reader.result);
    };
  };
  return (
    <div className="upload-icon">
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        value={fileName}
        onChange={handleFileSelect}
      />
      {/* <span
        className="me-2 text-small"
        style={{ color: "grey", transform: "translateY(10)" }}
      >
        {name}
      </span> */}
      <Button
        onClick={() => {
          inputRef?.current?.click();
        }}
        variant="custom"
        title="Import from a file"
        className="icon-button"
      >
        {/* {fileName ? `Uploaded` : "Upload"} */}
        <UploadFile color="blue" />
      </Button>
    </div>
  );
};

const codeString = `
hello world 
'''
x= 30
y= 40
print(x+y)
'''
`;
const Result = ({ response, setIsHome }) => {
  const [testPlan, setTestPlan] = useState(response.split(`'''`)?.[0] ?? "");
  const [testCode, setTestCode] = useState(response.split(`'''`)?.[1] ?? "");
  // const testPlan = response.split(`'''`)?.[0];
  // const testCode = response.split(`'''`)?.[1];
  return (
    <>
      <div className="row mx-3" style={{ height: "65vh" }}>
        <div className="col-6 p-3 test-plan">
          {/* <div>lorem {testPlan}</div> */}
          <h3>Test Plan</h3>
          <div style={{ position: "relative" }}>
            <Form.Control
              className=""
              as="textarea"
              rows={10}
              value={testPlan}
              // readOnly
              style={{ height: "60vh", overflow: "auto" }}
              onChange={(e, v) => setTestPlan(v)}
            />
            <div className="upload-icon pt-1">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(testPlan);
                }}
                className="icon-button"
                variant="custom"
                title="Import from a file"
              >
                {/* {fileName ? `Uploaded` : "Upload"} */}
                <CopyAllFile color="blue" />
              </Button>
              <Button
                onClick={() => {
                  downloadTextFile(testPlan, "test_plan.txt");
                }}
                className="icon-button"
                variant="custom"
                title="Import from a file"
              >
                {/* {fileName ? `Uploaded` : "Upload"} */}
                <DownloadFile color="blue" />
              </Button>
            </div>
          </div>
          {/* <UploadButton setInputText={(e) => setInputText(e)} /> */}
        </div>
        <div className="col-6 p-3">
          {/* <pre>
            <SyntaxHighlighter
              language="python"
              style={docco}
              customStyle={{ minHeight: "100%" }}
            >
              {testCode}
            </SyntaxHighlighter>
          </pre> */}
          <h3>Test Code</h3>
          <div style={{ height: "100%", position: "relative" }}>
            <CodeEditor code={testCode} setCode={setTestCode} />
            <div className="upload-icon">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(testCode);
                }}
                className="icon-button"
                variant="custom"
                title="Import from a file"
              >
                {/* {fileName ? `Uploaded` : "Upload"} */}
                <CopyAllFile color="blue" />
              </Button>
              <Button
                onClick={() => {
                  downloadTextFile(testCode, "test_code.py");
                }}
                className="icon-button"
                variant="custom"
                title="Import from a file"
              >
                {/* {fileName ? `Uploaded` : "Upload"} */}
                <DownloadFile color="blue" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12 mt-3">
          <Button onClick={() => setIsHome(true)}>Try with another file</Button>
        </div>
      </div>
    </>
  );
};

const downloadTextFile = (content, fileName) => {
  const element = document.createElement("a");
  const file = new Blob([content], {
    type: "text/plain",
  });
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};

const LoadingScreen = ({}) => {
  return (
    <div className="Container">
      <h3>Generating Test plan and Test code. This can take some time...</h3>
      <div className="row mx-3 d-flex content-justify-center" style={{ height: "60vh" }}>
        <div className="col-6">
          <Skeleton variant="rectangular" width={"90%"} height={"90%"} />
        </div>
        <div className="col-6">
          <Skeleton variant="rectangular" width={"90%"} height={"90%"} />
        </div>
      </div>
    </div>
  );
};
