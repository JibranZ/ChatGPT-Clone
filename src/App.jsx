import { useState, useEffect } from "react";

const App = () => {
  // Define the state variables

  // The current input value
  const [value, setValue] = useState(null);
  // The current response
  const [message, setMessage] = useState(null);
  // All chat messages
  const [previousChats, setPreviousChats] = useState([]);
  //title of curr chat
  const [currentTitle, setCurrentTitle] = useState(null);

  // function to create new chat
  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  // Function to handle clicking on a chat title
  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  };

  // Function to send a message to the backend
  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (err) {
      console.error(err);
    }
  };

  // Effect to update the chat history when message or title changes
  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        { title: currentTitle, role: "user", content: value },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);

  // Filter messages by the current chat title
  const currentChat = previousChats.filter(
    (previousChats) => previousChats.title === currentTitle
  );

  // Code for getting a unique item from a group of items
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChats) => previousChats.title))
  );

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitles, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitles)}>
              {uniqueTitles}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by Jibran</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>JibranGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
          </div>
          <p className="info">
            Chat GPT Mar 14 Version. Free Research Preview. Our goal is to make
            AI systms more natural and safe to interact with. Your feedback will
            help us improve
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
