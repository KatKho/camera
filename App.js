import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false); 
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true); 
    Alert.alert(
      'Open Link',
      `Do you want to open this link: ${data}?`,
      [
        {
          text: 'Cancel',
          onPress: () => setScanned(false),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => Linking.openURL(data) } 
      ],
      { cancelable: false }
    );
  };

  const flipCamera = () => {
    setType(type === Camera.Constants.Type.back
      ? Camera.Constants.Type.front
      : Camera.Constants.Type.back);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} 
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
      />
      {scanned && ( 
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}
      <View style={styles.buttonContainer}>
        <Button
          title="Flip Camera"
          onPress={flipCamera}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff',
    justifyContent: 'flex-end', 
  },
  camera: {
    ...StyleSheet.absoluteFillObject, 
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: 20,
    justifyContent: 'center',
  },
});
