import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { Scene, Router, ActionConst } from 'react-native-router-flux';
import { Provider } from 'react-redux';
import store from './redux/store';
import * as t from './actions/actionTypes/miscTypes';

import Registration from './containers/Registration';
import SendFile from './containers/BookKeepingOptions/SendFile';
import OpenFile from './containers/BookKeepingOptions/OpenFile';
import DeleteFile from './containers/BookKeepingOptions/DeleteFile';
import RecipientList from './containers/BookKeepingOptions/RecipientList';
import Scanner from './containers/BookKeepingOptions/Scanner';
import FileDetails from './containers/FileDetails';
import ProtectedView from './components/ProtectedView';
import EditGuest from './containers/EditGuest';
import QRGenerator from './containers/QRGenerator';
import { normalize } from './theme/baseTheme';

const date = new Date();
const month = date.getMonth() + 1, day = date.getDate();
const dailyName = `GB${date.getFullYear()}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}`;
const pathToFolder = `${Platform.OS === 'android' ? RNFetchBlob.fs.dirs.DownloadDir : RNFetchBlob.fs.dirs.DocumentDir}/GBdata`;

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }} >
          <Router>
            <Scene key="root" hideNavBar >
              <Scene key="registration" initial={true} type={ActionConst.REPLACE}
                component={(props) => <Registration folder={pathToFolder} filename={`${dailyName}.csv`} scannedInfo={props.scannedInfo} />}
                title={"Registration"} hideNavBar />
              <Scene key="fileDetails" type={ActionConst.REPLACE}
                component={(props) => <FileDetails folder={pathToFolder} filename={props.filename} guests={props.guests} />}
                title={"FileDetails"} hideNavBar onEnter={() => store.dispatch({ type: t.HIDE_ADMIN })} onExit={() => store.dispatch({ type: t.SHOW_ADMIN })} />
              <Scene key="editGuest" type={ActionConst.REPLACE}
                component={(props) => <EditGuest folder={pathToFolder} filename={props.filename} guests={props.guests} guestIndex={props.guestIndex} />}
                title={"EditGuest"} hideNavBar />
              <Scene key="qrGenerator" component={QRGenerator} title={"QRGenerator"} hideNavBar onEnter={() => store.dispatch({ type: t.HIDE_ADMIN })} onExit={() => store.dispatch({ type: t.SHOW_ADMIN })} />
              <Scene key="scanner" component={Scanner} title={"Scanner"} hideNavBar onEnter={() => store.dispatch({ type: t.HIDE_ADMIN })} onExit={() => store.dispatch({ type: t.SHOW_ADMIN })} />
            </Scene>
          </Router>
          <ProtectedView
            password={dailyName}
            protectedContents={(access) =>
              <View style={{ justifyContent: 'space-between', height: normalize(210) }} >
                <RecipientList folder={pathToFolder} buttonAccess={access} />
                <SendFile folder={pathToFolder} buttonAccess={access} />
                <OpenFile folder={pathToFolder} buttonAccess={access} />
                <DeleteFile folder={pathToFolder} buttonAccess={access} />
              </View>
            }
          />
        </View>
      </Provider>
    );
  }
}
