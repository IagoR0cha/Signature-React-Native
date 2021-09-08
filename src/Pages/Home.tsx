import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, Image, Alert, SafeAreaView } from 'react-native';
import SignatureScreen, { SignatureViewRef } from "react-native-signature-canvas";
import * as ScreenOrientation from 'expo-screen-orientation';
import * as FileSystem from "expo-file-system";

export function Home() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState('');
  const ref = useRef<SignatureViewRef>(null);
  const styleSignature = `.m-signature-pad--footer {display: none; margin: 0px;} body,html {height: 100%; width: 100%;}`;

  function clearSignature() {
    ref.current?.clearSignature();
  }

  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
  }

  function endSignature() {
    ref.current?.readSignature();
  }

  function showSignature(signature: string) {
    setSignature(signature);
  }

  function saveSignature() {
    const path = FileSystem.cacheDirectory + 'signature.png';
    FileSystem.writeAsStringAsync(
      path,
      signature.replace('data:image/png;base64,', ''),
      { encoding: FileSystem.EncodingType.Base64 }
    )
    .then(async () => {
      const info = await FileSystem.getInfoAsync(path);
      console.log(info)
      Alert.alert(
        'Assinatura sava com sucesso! ',
        `uri: ${info.uri}`,
        [{
          text: 'OK',
          onPress: () => setSignature(''),
        }]
      );
    })
    .catch((err) => console.log('DEU RUIM => ', err));
  }

  useEffect(() => {
    changeScreenOrientation();
  }, [])


  return (
    <View style={styles.container}>
      <SignatureScreen
        ref={ref}
        onOK={showSignature}
        onBegin={() => setIsDrawing(true)}
        onEnd={() => setIsDrawing(false)}
        webStyle={styleSignature}
      />
      {!isDrawing ?
        <View style={styles.footer}>
          <TouchableOpacity onPress={endSignature}>
            <View style={styles.button}>
              <Text style={styles.textButton}>Salvar</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearSignature} >
            <View style={styles.button}>
              <Text style={styles.textButton}>Limpar</Text>
            </View>
          </TouchableOpacity>
        </View>
        :
        null
      }
      <Modal
        animationType="slide"
        transparent
        visible={!!signature}
      >
        <View style={styles.modalBackgroundContainer}>
          <View style={styles.modalContainer}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{ uri: signature }}
            />
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={saveSignature}>
                <View style={[styles.button, { backgroundColor: '#99ff00' }]}>
                  <Text style={styles.textButton}>Salvar</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSignature('')} >
                <View style={[styles.button, { backgroundColor: '#ff2200' }]}>
                  <Text style={styles.textButton}>Cancelar</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0055ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  textButton: {
    color: '#fff',
    fontWeight: 'bold'
  },
  modalBackgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000055'
  },
  modalContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10
  },
  image: {
    width: 435,
    height: 214
  },
  modalFooter: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  }
});