import React from 'react';
import './App.css';
import { Event } from './models/Event';
import { QaManager } from "./components/QaManager";
import { WebChat } from "./components/WebChat";

function App(props) {
  const tempUserId = 'TempUserId';
  let toDispatch = [];

  const [ qnAs, setQnAs ] = React.useState({});
  const { store, eventDispatcher } = props;
  const webChatToken = process.env.REACT_APP_WEB_CHAT_TOKEN;

  React.useEffect(()=>{
    const eventListener = eventDispatcher.register((event) => {
      if (event.name === Event.GetQnA) {
        setQnAs(event.value);
      }
    });
    return ()=>{eventDispatcher.unregister(eventListener)};
  });

  const addDebug = (error) => {

  };

  const clickDoSync = async () => {
    // const toDispatch = this.toDispatch.length;
    toDispatch.forEach(element => {
      store.dispatch(element);
    });
    toDispatch = [];

    // TODO why? maybe it causes a refresh of UI which breaks directline
    // setTimeout(() => {this.addDebug(`Sent ${toDispatch} configs.`);}, 1000);
  };

  const pushEvent = (name, value, sync = false) => {
    toDispatch.push({
      type: 'WEB_CHAT/SEND_EVENT',
      payload: {name: name, value: value}
    });

    // this.addDebug(`${name}:${value}`);

    if (sync) {
      clickDoSync();
    }
  };

  const clickSyncToThis = async (knowledgeBaseId) => {

  };

  return (
    <div className="App">
      <QaManager
        qnAs={qnAs}
        syncToThis={clickSyncToThis}
        pushEvent={pushEvent}
        clickDoSync={clickDoSync}
        addDebug={addDebug}
      />
      <WebChat webChatToken={webChatToken} tempUserId={tempUserId} store={store} />
    </div>
  );
}

export default App;
