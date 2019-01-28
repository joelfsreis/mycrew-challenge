import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, View, TextInput, Text, Platform} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Button from '../components/Button';

type Props = {
  username: string,
  valid: boolean,
  error: string,
};

const ios = Platform.select({
  ios: true,
  android: false,
});

const INITIAL_STATE = {
  username: '',
  valid: false,
  error: '',
  ios,
}

export default class RegisterScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  static navigationOptions = () => {
    return {
      title: 'MyCrew Unicorn',
      headerLeft: null,
    }
  };

  componentDidMount() {
    AsyncStorage.getItem('username').then(username => {
      if (username !== null) {
        this.onPress(username);
      }
    });
  }
  

  onChangeText(text) {
    const username = text.trim();
    const stringRegex = /([a-z]|[A-Z]){6,}/;
    const numberRegex = /[0-9]+/;
    let valid = true;
    let error = '';
  
    if (numberRegex.test(username)) {
      valid = false;
      error = 'No numbers please!';
    } else if (!stringRegex.test(username)){
      valid = false;
      error = 'Your need at least 6 letters for you name';
    }
    this.setState({ username, valid, error });
  }

  onPress(username) {
    const { navigate } = this.props.navigation;

    AsyncStorage.setItem('username', username).then(() => {
      navigate('Race', { username });
      setTimeout(() => this.setState(INITIAL_STATE), 1000);
    });
  }

  render() {
    const { username, valid, error, ios } = this.state;
    const inputStyle = valid ? [styles.input, styles.valid] : [styles.input, styles.invalid];

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{ valid ? `Let's Race...` : 'Are you ready?'}</Text>
        <TextInput
          placeholder="Your Name"
          style={inputStyle}
          onChangeText={(text) => this.onChangeText(text)}
          value={username}
        ></TextInput>
        <Text style={styles.error}>{error ? error : ''}</Text>
        <Button text="RACE" icon="horse-head" disabled={!valid} onPress={() => this.onPress(username)}></Button>
        { ios ? <KeyboardSpacer/> : null }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFCAF2',
    padding: 16,
  },
  input: {
    height: 56,
    alignSelf: 'stretch',
    padding: 8,
    margin: 8,
    fontSize: 18,
    fontWeight: "600",
    borderRadius: 8,
    borderColor: 'purple',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  valid: {
    backgroundColor: '#98FB98',
    color: 'black',
  },
  invalid: {
    backgroundColor: '#FFA07A',
    color: 'white',
  },
  title: {
    fontWeight: '900',
    fontSize: 32,
    marginBottom: 24,
  },
  error: {
    color: 'red',
    fontWeight: '700',
    fontSize: 12,
  }
});
