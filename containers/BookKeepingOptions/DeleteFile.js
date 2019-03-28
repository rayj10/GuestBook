import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import DialogBoxModal from '../../components/DialogBoxModal';
import IconWrapper from '../../components/IconWrapper';
import { color, normalize, fontSize, fontFamily, windowHeight, windowWidth } from '../../theme/baseTheme';

const styles = StyleSheet.create({
  buttons: {
    width: normalize(45),
    height: normalize(45),
    borderRadius: normalize(22.5),
    justifyContent: 'center',
    shadowOpacity: 0.4,
    elevation: 5
  },
  dialogText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.regular,
    color: color.black,
    marginVertical: normalize(5),
    marginLeft: normalize(10),
    marginBottom: normalize(20)
  },
  listItem: {
    flex: 1,
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: color.light_grey,
    borderRadius: normalize(2),
    justifyContent: 'space-between',
    alignItems: 'center',
    height: normalize(35)
  },
  listText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    marginLeft: normalize(10)
  },
  deleteText: {
    fontSize: fontSize.regular,
    fontFamily: fontFamily.bold,
    color: color.red,
    marginRight: normalize(10)
  }
});

export default class DeleteFile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteOpen: false,
      fileList: null,
    };
  }

  deleteModalContent() {
    if (this.state.fileList && this.state.fileList.length !== 0) {
      return this.state.fileList.map((item, key) =>
        <View key={key} style={styles.listItem}>
          <Text style={styles.listText}>{item}</Text>
          <TouchableOpacity onPress={() => this.deleteFile(item)}>
            <Text style={styles.deleteText}> Delete </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
      return <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.dialogText}> No items to be deleted </Text>
      </View >;
  }

  deleteFile(filename) {
    var path = `${this.props.folder}/${filename}`;

    RNFetchBlob.fs.unlink(path)
      .then(() => {
        var files = this.state.fileList;
        var idx = files.indexOf(filename);
        files.splice(idx, 1);
        this.setState(files);
        Alert.alert('Delete Successful', `${filename} has been deleted successfully`)
      })
      .catch((err) => { alert(err) });
  }

  render() {
    return <View style={{ flex: 1 }}>
      <DialogBoxModal visible={this.state.deleteOpen}
        title={'Delete Record'}
        content={this.deleteModalContent()}
        buttons={[
          { text: 'Cancel', onPress: () => this.setState({ deleteOpen: false }) }
        ]}
        height={windowHeight() > windowWidth() ? 0.6 : 0.88}
        onBack={() => this.setState({ deleteOpen: false })}
        titleStyle={{ color: color.grey, alignSelf: 'center' }}
      />
      <IconWrapper
        onPress={() => {
          RNFetchBlob.fs.ls(this.props.folder).then((files) => this.setState({ fileList: files }));
          this.setState({ deleteOpen: true });
        }}
        name={'trashcan'} type={'octicon'} color={color.white} size={25}
        disabled={!this.props.buttonAccess}
        style={[styles.buttons, { backgroundColor: color.red }]} />
    </View>
  }
}
