import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  Image
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import FormData from "form-data";

export default function App() {
  const [text, setText] = useState(null);
  const [image, setImage] = useState(null);
  const form = new FormData();

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient Permissions",
        "You must grant permissions to use this app.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const sendTextRequestHandler = () => {
    console.log("text", text);
    axios
      .post("https://b1b4146d.ngrok.io/text-upload", { text })
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
    setText("");
  };

  const sendImgRequestHandler = async () => {
    if (!image) {
      return Alert.alert("No Photo", "You must take a photo to submit", [
        { text: "Okay" }
      ]);
    } else {
      const imgObj = {
        uri: image,
        name: image.split("/").pop(),
        type: "image"
      };
      form.append("image", imgObj);
      axios({
        method: "post",
        url: "https://0882c043.ngrok.io/image-upload",
        data: form,
        headers: {
          "content-type": `multipart/form-data`
        }
      });
    }
    setImage(null);
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    const img = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5
    });
    setImage(img.uri);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text>Type in some text to send to our S3 bucket!</Text>
        <TextInput
          value={text}
          onChangeText={text => setText(text)}
          style={styles.textInput}
        />
        <Button
          title="Submit"
          onPress={sendTextRequestHandler}
          disabled={!text ? true : false}
        />
      </View>
      <View style={styles.bottom}>
        <View style={styles.imagePreview}>
          {!image ? (
            <Text>No image selected.</Text>
          ) : (
            <Image style={styles.image} source={{ uri: image }} />
          )}
        </View>
        <Button title="Take Image" onPress={takeImageHandler} />
        <Button
          title="Submit"
          onPress={sendImgRequestHandler}
          disabled={!image ? true : false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    minHeight: 40,
    width: "90%"
  },
  top: {
    flex: 1,
    borderWidth: 5,
    borderColor: "gold",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 20
  },
  bottom: {
    flex: 1,
    borderWidth: 5,
    borderColor: "purple",
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "space-around"
  },
  imagePreview: {
    width: "80%",
    height: 200,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1
  },
  image: {
    width: "100%",
    height: "100%"
  }
});
