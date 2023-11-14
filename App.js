import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { NativeBaseProvider, VStack, HStack, Alert, Button as NBButton, IconButton, CloseIcon, Box } from 'native-base';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [showAlert, setShowAlert] = useState(false); 
  const [scannedData, setScannedData] = useState(''); 

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScannedData(data); 
    setShowAlert(true); 
    setScanned(true); 
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
    <NativeBaseProvider>
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
          <NBButton onPress={() => setScanned(false)} colorScheme="lightBlue" variant="solid" style={styles.scanButton}>
            Tap to Scan Again
          </NBButton>
        )}
        <View style={styles.buttonContainer}>
          <NBButton onPress={flipCamera} colorScheme="lightBlue" variant="solid">
            Flip Camera
          </NBButton>
        </View>

        {showAlert && (
          <Alert w="100%" status="info" colorScheme="warning" variant="top-accent" isOpen={showAlert}>
          <VStack space={2} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} justifyContent="space-between">
              <HStack space={2} flexShrink={1}>
                <Alert.Icon mt="1" />
                <Text fontSize="md" color="coolGray.800">
                  Open Link
                </Text>
              </HStack>
              <IconButton
                variant="unstyled"
                _focus={{
                  borderWidth: 0
                }}
                icon={<CloseIcon size="3" />}
                _icon={{
                  color: "coolGray.600"
                }}
                onPress={() => setShowAlert(false)}
              />
            </HStack>
            <Box pl="6" _text={{
              color: "coolGray.600"
            }}>
              Do you want to open this link: {scannedData}?
            </Box>
           <HStack space={4} justifyContent="center"> 
            <NBButton colorScheme="blue" variant="subtle" onPress={() => { setShowAlert(false); setScanned(false); }}>
              Cancel
            </NBButton>
            <NBButton colorScheme="blue" variant="subtle" onPress={() => { Linking.openURL(scannedData); }}>
              OK
            </NBButton>
          </HStack>
          </VStack>
        </Alert>
        )}
        </View>
    </NativeBaseProvider>
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
