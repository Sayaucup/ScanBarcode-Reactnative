import React, { Component } from 'react';
import { Text, View, Linking, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet,Image} from 'react-native';
import { CameraKitCameraScreen, } from 'react-native-camera-kit';
import {db} from './firebase'
console.disableYellowBox=true
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      
      qrvalue: '',
      opneScanner: false,
    };
  }
  
  onBarcodeScan(qrvalue) {
    this.setState({ qrvalue: qrvalue });
    this.setState({ opneScanner: false });
    // langsung di push ke firebase hasil dari scan
    db.ref('/po').push(qrvalue)
  }
  onOpneScanner() {
    var that =this;
    if(Platform.OS === 'android'){
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,{
              'title': 'CameraExample App Camera Permission',
              'message': 'CameraExample App needs access to your camera '
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            that.setState({ qrvalue: '' });
            that.setState({ opneScanner: true });
          } else {
            alert("CAMERA permission denied");
          }
        } catch (err) {
          alert("Camera permission err",err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    }else{
      that.setState({ qrvalue: '' });
      that.setState({ opneScanner: true });
    }    
  }
  onOpenlink() {
    Linking.openURL(this.state.qrvalue);
  }
  render() {
    
    if (!this.state.opneScanner) {
      return (
        <View style={{flex:1}}>
          <View style={{padding:20,backgroundColor:'#2989A9',justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:20,color:'#fff',fontWeight:'bold'}}>QR Code</Text>
          </View>
          <View style={{paddingVertical:10,backgroundColor:'#fff',elevation:15,borderRadius:10,margin:8}}>
            <Text style={{fontSize:15,marginLeft:10}}>Results :</Text>
            <Text style={{fontSize:13,marginLeft:15}}>{this.state.qrvalue}</Text>
            <View style={{justifyContent:'center',flexDirection:'row',marginTop:10}}>
            <TouchableOpacity onPress={() => this.onOpneScanner()}>
                <View style={{flexDirection:'row',paddingVertical:10,width:'100%',backgroundColor:'#2989A9',borderRadius:10,marginRight:1}}>
                  <Image style={{height:25,width:25,backgroundColor:'#fff',marginLeft:15}} source={require('./qr.png')}/>
                  <Text style={{fontSize:15,marginHorizontal:16,color:'#fff'}}>Scan Qr Code</Text>
                </View>
              </TouchableOpacity>
              {this.state.qrvalue.includes('http') ?
              <TouchableOpacity onPress={() => this.onOpenlink()}>
              <View style={{flexDirection:'row',paddingVertical:10,width:'100%',backgroundColor:'#2989A9',borderRadius:10,marginLeft:1}}>
                <Image style={{height:25,width:25,backgroundColor:'#fff',marginLeft:15}} source={require('./chain.png')}/>
                <Text style={{fontSize:15,marginHorizontal:16,color:'#fff'}}>Go To Link</Text>
              </View>
            </TouchableOpacity>
            : null
            }
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <CameraKitCameraScreen
          showFrame={true}
          scanBarcode={true}
          laserColor={'green'}
          frameColor={'white'}
          colorForScannerFrame={'black'}
          onReadCode={event =>
            this.onBarcodeScan(event.nativeEvent.codeStringValue)
          }
        />
      </View>
    );
  }
}
