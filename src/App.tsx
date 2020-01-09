import React from 'react';
import './App.css';
import { AddSourceEvent, Event } from './models/Event';
import { QaManager } from "./components/QaManager";
import { WebChat } from "./components/WebChat";
declare let chrome: { tabs: any };

function App(props: { store: any, eventDispatcher: any}) {
  const tempUserId = 'TempUserId';
  let toDispatch: any[] = [];

  const [ qnAs, setQnAs ] = React.useState({});
  const { store, eventDispatcher } = props;
  const webChatToken = String(process.env.REACT_APP_WEB_CHAT_TOKEN);

  React.useEffect(()=>{
    const eventListener = eventDispatcher.register((event: {name:string, value:any}) => {
      if (event.name === Event.GetQnA) {
        setQnAs(event.value);
      }
    });
    return ()=>{eventDispatcher.unregister(eventListener)};
  });

  const addDebug = (error: any) => {

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

  const pushEvent = (name: string, value: any, sync = false) => {
    toDispatch.push({
      type: 'WEB_CHAT/SEND_EVENT',
      payload: {name: name, value: value}
    });

    // this.addDebug(`${name}:${value}`);

    if (sync) {
      clickDoSync();
    }
  };

  const clickSyncToThis = async (knowledgeBaseId: string) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs: any[]) {
      const activeTab = tabs[0];
 
      let value: AddSourceEvent = {
        knowledgeBaseId: knowledgeBaseId,
        urlsDescription: [activeTab.title],
        urls: [activeTab.url]
      };

      pushEvent(Event.AddSource, value, true);
   });
  };

  return (
    <div className="App">
      <QaManager
        qnAs={qnAs}
        fileHostUrl={process.env.REACT_APP_FILE_HOST_URL}
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
