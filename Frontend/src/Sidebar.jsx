import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setcurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  // Fetch all threads
  const getAllThreads = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread`);
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  // Create a new chat
  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setcurrThreadId(uuidv1());
    setPrevChats([]);
  };

  // Switch to an existing thread
  const changeThread = async (newThreadId) => {
    setcurrThreadId(newThreadId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread/${newThreadId}`
      );
      const res = await response.json();
      console.log(res);
      // Backend returns thread.messages, so setPrevChats should use res directly
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  // Delete a thread
  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread/${threadId}`,
        { method: "DELETE" }
      );
      const res = await response.json();
      console.log(res);

      // Remove deleted thread from state
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      // If current thread was deleted, reset to a new chat
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src="/blacklogo.png" alt="gpt logo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation(); // prevent click bubbling
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By&nbsp;&nbsp;RAJAT</p>
      </div>
    </section>
  );
}

export default Sidebar;
