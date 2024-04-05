import React, { useState, useEffect } from "react";

const userPic = "path_to_chatgpt_pic.png"; // Replace with actual path
const chatGptPic = "path_to_chatgpt_pic.png"; // Replace with actual path

const Message = ({ id, text, isUser, onEdit, history }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [showHistory, setShowHistory] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
    setShowHistory(false);
  };

  const handleSave = () => {
    onEdit(id, editedText, history);
    setEditMode(false);
  };

  return (
    <div className="gptui-right-middl">
      <div className="chatone__profile"></div>
      <div className="profile__details">
        <div className={`message ${isUser ? "user" : "bot"}`}>
          <img
            src={isUser ? userPic : chatGptPic}
            alt={isUser ? "User" : "ChatGPT"}
          />
        </div>
        <div className="chatone-child">
          <div className="message-content">
            {isUser ? (
              <span>
                You {isUser && <button onClick={handleEdit}>Edit</button>}
              </span>
            ) : (
              <span>ChatGPT response</span>
            )}
            {editMode ? (
              <div>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={handleSave}>Save</button>
              </div>
            ) : (
              <div>
                <p>{text}</p>

                {!isUser && history.length > 0 && (
                  <button onClick={() => setShowHistory(!showHistory)}>
                    Show History
                  </button>
                )}
                {showHistory && (
                  <div className="history-carousel">
                    {history.map((response, index) => (
                      <p key={index}>{response}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputValues, setInputValues] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [historyCarousel, setHistoryCarousel] = useState([]);

  useEffect(() => {
    const storedMessages =
      JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(storedMessages);
  }, []);

  const handleMessageSubmit = (message) => {
    const newMessage = { text: message, isUser: true };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    localStorage.setItem("chatMessages", JSON.stringify(newMessages));

    // Generate initial bot response after 1 second
    setTimeout(() => {
      const initialBotResponse = "Hello, I'm ChatGPT!";
      setBotResponse(initialBotResponse);
      const botMessage = { text: initialBotResponse, isUser: false };
      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    }, 1000);
  };

  const handleEdit = (id, editedText, history) => {
    const editedMessages = messages.map((msg) =>
      msg.id === id ? { ...msg, text: editedText } : msg
    );
    setMessages(editedMessages);

    // Update bot response with edited text after 1 second
    setTimeout(() => {
      const updatedBotResponse = `You edited your message to: "${editedText}".`;
      setBotResponse(updatedBotResponse);
      const botMessage = { text: updatedBotResponse, isUser: false };
      const updatedMessages = [...editedMessages, botMessage];
      setMessages(updatedMessages);
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    }, 1000);

    setHistoryCarousel(
      history.map((item, index) => <span key={index}>{item}</span>)
    );
  };

  const handleRegenerate = () => {
    // Simulate new bot response after 1 second
    setTimeout(() => {
      const newBotResponse = "I'm ChatGPT, generating a new response!";
      setBotResponse(newBotResponse);
      const botMessage = { text: newBotResponse, isUser: false };
      const updatedMessages = [...messages, botMessage];
      setMessages(updatedMessages);
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    }, 1000);
  };

  return (
    <div className="App">
      <div className="chat-window">
        <div className="message-container">
          {messages.map((msg, index) => (
            <Message
              key={index}
              id={index}
              text={msg.text}
              isUser={msg.isUser}
              history={msg.history || []}
              onEdit={handleEdit}
            />
          ))}
        </div>
        <div className="bot-response">
          <p>{botResponse}</p>
          <button onClick={handleRegenerate}>Regenerate</button>
        </div>
        {historyCarousel.length > 0 && (
          <div className="history-carousel">
            <p>Message History:</p>
            <div>{historyCarousel}</div>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleMessageSubmit(inputValues);
            setInputValues("");
          }}
          className="input-box"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValues}
            onChange={(e) => setInputValues(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ChatApp;
