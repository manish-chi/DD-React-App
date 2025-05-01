import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { createStore } from 'botframework-webchat';

import WebChat from './WebChat';
//add a line..
import './fabric-icons-inline.css';
import './MinimizableWebChat.css';

const MinimizableWebChat = () => {
  const store = useMemo(
    () =>
      createStore({}, ({ dispatch }) => next => action => {
        if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
          dispatch({
            type: "WEB_CHAT/SEND_EVENT",
            payload: {
              name: "webchat/join"
            },
          });
        } else if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
          if (action.payload.activity.from.role === 'bot') {
            setNewMessage(true);
          }
        }

        return next(action);
      }),
    []
  );

  // const styleSet = useMemo(
  //   () =>
  //     createStyleSet({
  //       primaryFont: "Poppins, sans-serif",
  //       backgroundColor: "Transparent",
  //       bubbleBorderColor: "rgb(230, 108, 51)",
  //       sendBoxButtonColorOnHover: "#ff9742",
  //       bubbleFromUserBackground: "rgb(230, 108, 51)",
  //       sendBoxBorderTop: "solid 2px rgb(230, 108, 51)",
  //       bubbleBorderRadius: 19,
  //       bubbleFromUserBorderRadius: 19,
  //       suggestedActionBorderColor: "rgb(230, 108, 51)",
  //       suggestedActionBorderRadius: 9,
  //       suggestedActionTextColor: "rgb(230, 108, 51)",
  //       cardEmphasisBackgroundColor: "rgb(230, 108, 51)",
  //       cardPushButtonTextColor: "rgb(230, 108, 51)",
  //       cardPushButtonBackgroundColor: "rgb(230, 108, 51)",
  //     }),
  //   []
  // );

  const styleOptions = {
    hideUploadButton: true,
    botAvatarImage:
      "https://dhabadeliciousstorage.blob.core.windows.net/dhabadeliciouscontainer/bot-icon.png",
    botAvatarInitials: "BF",
    userAvatarImage: `https://dhabadeliciousstorage.blob.core.windows.net/dhabadeliciouscontainer/1684515034933.jpeg`,
    userAvatarInitials: "WC",
    suggestedActionLayout: "carousel",
    bubbleNubOffset: "bottom",
    bubbleFromUserBorderStyle: 'solid',
    bubbleFromUserBorderRadius:9,
    bubbleBorderRadius:9,
    bubbleBorderWidth:2,
    bubbleFromUserNubOffset:"bottom",
    bubbleFromUserNubSize:5,
    bubbleNubSize:5,
    primaryFont: "Poppins, sans-serif",
    backgroundColor: "Transparent",
    bubbleBorderColor: "rgb(230, 108, 51)",
    sendBoxButtonColorOnHover: "#ff9742",
    bubbleFromUserBackground: "rgb(230, 108, 51)",
    sendBoxBorderTop: "solid 2px rgb(230, 108, 51)",
    suggestedActionBorderColor: "rgb(230, 108, 51)",
    suggestedActionBorderRadius: 9,
    suggestedActionTextColor: "rgb(230, 108, 51)",
    cardEmphasisBackgroundColor: "rgb(230, 108, 51)",
    cardPushButtonTextColor: "rgb(230, 108, 51)",
    cardPushButtonBackgroundColor: "rgb(230, 108, 51)",
  };

 

  const [loaded, setLoaded] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const [newMessage, setNewMessage] = useState(false);
  const [side, setSide] = useState('right');
  const [token, setToken] = useState();

  // To learn about reconnecting to a conversation, see the following documentation:
  // https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-reconnect-to-conversation?view=azure-bot-service-4.0

  const handleFetchToken = useCallback(async () => {
    if (!token) {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/config/66cc240c2b0664128bf63752`, {
        method: "GET",
      });
      let { token } = await res.json();
      setToken(token);}
  }, [setToken, token]);

  const handleMaximizeButtonClick = useCallback(async () => {
    setLoaded(true);
    setMinimized(false);
    setNewMessage(false);
  }, [setMinimized, setNewMessage]);

  const handleMinimizeButtonClick = useCallback(() => {
    setMinimized(true);
    setNewMessage(false);
  }, [setMinimized, setNewMessage]);

  const handleSwitchButtonClick = useCallback(() => {
    setSide(side === 'left' ? 'right' : 'left');
  }, [setSide, side]);

  // TODO: [P2] Currently, we cannot unmount Web Chat from DOM when it is minimized.
  //       Today, if we unmount it, Web Chat will call disconnect on DirectLineJS object.
  //       When minimized, we still want to maintain that connection while the UI is gone.
  //       This is related to https://github.com/microsoft/BotFramework-WebChat/issues/2750.

  return (
    <div className="minimizable-web-chat">
      {minimized && (
        <button className="maximize" onClick={handleMaximizeButtonClick}>
          <span className={token ? 'ms-Icon ms-Icon--MessageFill' : 'ms-Icon ms-Icon--Message'} />
          {newMessage && <span className="ms-Icon ms-Icon--CircleShapeSolid red-dot" />}
        </button>
      )}
      {loaded && (
        <div className={classNames(side === 'left' ? 'chat-box left' : 'chat-box right', minimized ? 'hide' : '')}>
          <header>
            <div className="filler" />
            <button className="switch" onClick={handleSwitchButtonClick}>
              <span className="ms-Icon ms-Icon--Switch" />
            </button>
            <button className="minimize" onClick={handleMinimizeButtonClick}>
              <span className="ms-Icon ms-Icon--ChromeMinimize" />
            </button>
          </header>
          <WebChat
            className="react-web-chat"
            onFetchToken={handleFetchToken}
            store={store}
            token={token}
            styleOptions={styleOptions}
          />
        </div>
      )}
    </div>
  );
};

export default MinimizableWebChat;
