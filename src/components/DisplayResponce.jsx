import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition-es";
import { getApiMessage } from "../app/features/cohereSlice";
import {
  getRawPrompt,
  getResponcePrompt,
} from "../app/features/translateSlice";
import { countries } from "../extras/contries";
import styles from "./display.module.css";

// import sections
function DisplayResponce() {
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [englishResponce, setEnglishResponce] = useState("");
  const [translatedResponce, setTranslatedResponce] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // hooks section
  const dispatch = useDispatch();
  const translatorFromSelector = useSelector(
    (state) => state.translation.translatestFromText
  );
  const translatorToSelector = useSelector(
    (state) => state.translation.translatestToText
  );
  const translatedResponceSelector = useSelector(
    (state) => state.translation.translatedResponse
  );
  const getAiResponceFromCohere = useSelector(
    (state) => state.cohere.apiResponces
  );
  const cohereLoading = useSelector((state) => state.cohere.loading);
  const loadingState = useSelector((state) => state.translation.loading);
  const startListning = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListning = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };
  if (!browserSupportsSpeechRecognition) {
    return <alert>Browser doesn't support speech recognition.</alert>;
  }

  const handelFetchCohereData = () => {
    //a condition statement dackta hy ki input language
    // english hy ya nahi agr nahi hua to translate karega
    // vrna seedha api fetch karega
    // stopListning();
    stopListning();
    if (selectedCountry !== "en") {
      // used for translating the input text only
      dispatch(
        getRawPrompt({
          text: inputText,
          fromText: selectedCountry,
          toText: "en",
        })
      );
      // takes the translated text and makes an api request from cohere
      dispatch(getApiMessage(translatorFromSelector));
    } else {
      dispatch(getApiMessage(inputText));
    }
  };
  //to check ki data response se mela hy bhi ya nahi and agar selected country english nahi hy to translation k lea bhejo
  // TODO: fix the first response error bug
  useEffect(() => {
    if (getAiResponceFromCohere && selectedCountry != "en") {
      // TODO: dispatch thee response for translation NOTE that the from language will be en!!
      // english main jo response aya usse translate krneka code
      dispatch(
        getResponcePrompt({
          text: getAiResponceFromCohere,
          fromText: "en",
          toText: selectedCountry,
        })
      );
    } else {
      setEnglishResponce(getAiResponceFromCohere);
    }
  }, [getAiResponceFromCohere, selectedCountry, dispatch]);

  useEffect(() => {
    setInputText(transcript); // Update textarea value with transcript
  }, [transcript]);

  useEffect(() => {
    if (translatedResponceSelector) {
      console.log("got data from translator selector");
      setTranslatedResponce(translatedResponceSelector);
      console.log("translated response: ", translatedResponceSelector);
    }
  }, [translatedResponceSelector]);

  // handling functions
  const handleTextInput = (e) => {
    setInputText(e.target.value);
  };
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value); // Update selected country state when dropdown value changes
  };

  // text to speech
  useEffect(() => {
    let textToSpeak;
    let utterance;
    if (selectedCountry === "en") {
      textToSpeak = getAiResponceFromCohere;
      utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "en";
    } else {
      textToSpeak = translatedResponce;
      utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = selectedCountry;
    }
    // speechSynthesis.cancel();
    if (textToSpeak) {
      speechSynthesis.speak(utterance);
    }
  }, [
    englishResponce,
    getAiResponceFromCohere,
    selectedCountry,
    translatedResponce,
  ]);
  // jsx code
  return (
    <>
      <div className={styles.screen}>
        <div className={styles.contentContainer}>
          <textarea
            className={styles.textarea}
            cols="30"
            rows="10"
            value={inputText}
            onChange={handleTextInput}
          ></textarea>

          {/* voice recog */}
          <p>Microphone: {listening ? "on" : "off"}</p>

          <div className={styles.controls}>
            <select
              className={styles.select}
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              <option value="">Select a Language</option>
              {/* contriesh object main jitne bhi key value pairs 
        hyy ussse loop krke dekhayega*/}
              {Object.entries(countries).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            <button className={styles.button} onClick={startListning}>
              Start Hearing
            </button>
            <button className={styles.button} onClick={resetTranscript}>
              reset
            </button>
            {/* <button className={styles.button} onClick={handleSpeech}>
              Speech
            </button> */}
            <button className={styles.button} onClick={handelFetchCohereData}>
              Fetch
            </button>
          </div>
          <div className={styles.responceText}>
            <p style={{ color: "red", background: "white", padding: "1px" }}>
              NOTE: if you are testing this application note that im using a
              paid api to generate responce hence the number of responces will
              be limited hence i reduced the responce size of this application
              thats why you might see only half of the responce
            </p>
            <p>
              {loadingState || cohereLoading
                ? "Loading..."
                : translatedResponce || englishResponce}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default DisplayResponce;
