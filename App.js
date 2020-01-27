import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import axios from "axios";

export default function App() {
  const [text, setText] = useState("");

  const sendRequestHandler = () => {
    console.log("text", text);
    axios
      .post("https://b1b4146d.ngrok.io/text-upload", { text })
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  };

  return (
    <View style={styles.container}>
      <Text>Type in some text to send to our S3 bucket!</Text>
      <TextInput
        value={text}
        onChangeText={text => setText(text)}
        style={styles.textInput}
      />
      <Button title="Submit" onPress={sendRequestHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    minHeight: 40,
    width: "90%"
  }
});
