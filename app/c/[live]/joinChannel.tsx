
"use client"
import React, { useState, useEffect, useRef } from 'react';
import AgoraUIKit, { PropsInterface, layout } from 'agora-react-uikit';
import AgoraRTM from 'agora-rtm-sdk';

const APP_ID = 'c4d6e23287ed4da6b6831383945f9ed2';

const App = ({ channel, uid }: { channel: any; uid: string }) => {
  const messagesRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ text: string; uid: any }[]>([]);
  const [text, setText] = useState('');

  const appendMessage = (message: { text: string; uid: any }) => {
    setMessages((messages) => [...messages, message]);
  };

  useEffect(() => {
    const handleChannelMessage = (message: any, peerId: any) => {
      appendMessage({
        text: message.text,
        uid: peerId.uid,
      });
    };
    // changes

    if (channel) {
      channel.on('ChannelMessage', handleChannelMessage);
    }

    return () => {
      if (channel) {
        channel.off('ChannelMessage', handleChannelMessage);
      }
    };
  }, [channel]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text === '') return;
    channel.sendMessage({ text, type: 'text' });
    appendMessage({
      text: text,
      uid: uid,
    });
    setText('');
  };

  return (
    <div className="panel">
      <div className="messages" ref={messagesRef}>
        <div className="inner">
          {messages.map((message, idx) => (
            <div key={idx} className="message">
              {message.uid === uid && (
                <div className="user-self">
                  You:&nbsp;
                </div>
              )}
              {message.uid !== uid && (
                <div className="user-them">
                  Them:&nbsp;
                </div>
              )}
              <div className="text">{message.text}</div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={sendMessage}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message"
        />
        <button>+</button>
      </form>
    </div>
  );
};

interface AudienceProps {
  channelName: string; // Define the type of channelName prop
}

const Audience: React.FC<AudienceProps> = ({channelName}) => {
  const [videocall, setVideocall] = useState(false);
  const [isPinned, setPinned] = useState(false);
  const [channelsMap, setChannelsMap] = useState<Map<string, any>>(new Map());
  const [uid, setUid] = useState('');

  useEffect(() => {
    handleJoinChannel(channelName)
  }, []);

  const handleJoinChannel = async (channelName: string) => {
    // setSelectedChannel(channelName);

    // Check if the channel already exists
    if (channelsMap.has(channelName)) {
      const channelInstance = channelsMap.get(channelName);
      setVideocall(true);
      setUid(String(Math.floor(Math.random() * 1000000)));
      await channelInstance.join();
    } else {
      const client = AgoraRTM.createInstance(APP_ID);
      const newUid = String(Math.floor(Math.random() * 1000000));
      const trimmedChannelName = channelName.trim();

      try {
        await client.login({ uid: newUid, token: undefined });
        const newChannel = client.createChannel(trimmedChannelName);
        await newChannel.join();
        setChannelsMap(new Map(channelsMap.set(channelName, newChannel)));
        setVideocall(true);
        setUid(newUid);
      } catch (error) {
        console.error('Error creating/joining the channel:', error);
      }
    }
  };

  const props: PropsInterface = {
    rtcProps: {
      appId: APP_ID,
      channel: channelName,
      role: 'audience',
      layout: isPinned ? layout.pin : layout.grid,
    },
    callbacks: {
      EndCall: () => {
        setVideocall(false);
      },
    },
    styleProps: {
      localBtnContainer: { backgroundColor: 'green' },
    },
  };

  return (
    <div className="container">
          <h2 className="heading">
            You're <span className="person">an audience now</span>
          </h2>
          <AgoraUIKit rtcProps={props.rtcProps} callbacks={props.callbacks} styleProps={props.styleProps} />
          <div className="nav">
            <button className="btn" onClick={() => setPinned(!isPinned)}>
              Change Layout
            </button>
          </div>
          <App channel={channelsMap.get(channelName)} uid={uid} />
    </div>
  );
};

export default Audience;