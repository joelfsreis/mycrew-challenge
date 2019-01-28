import React, {Component} from 'react';
import {AsyncStorage, Platform, StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Button from '../components/Button';
import Unicorn from '../components/Unicorn';

const SIZE = Platform.select({
  ios: 4,
  android: 3,
});

const INITIAL_STATE = {
  name: '',
  size: SIZE,
  unicorns: [],
  winner: '',
  isRunning: false,
  finished: false,
  initialTime: 0,
  currentTime: 0,
  width: undefined,
}

export default class RaceScreen extends Component {
  constructor() {
    super();
    this.state = INITIAL_STATE;
  }

  static navigationOptions = () => {
    return {
      title: 'MyCrew Unicorn',
      headerLeft: null,
      headerRight: null
    }
  };

  componentDidMount() {
    const name = this.props && this.props.navigation && this.props.navigation.state
      && this.props.navigation.state.params && this.props.navigation.state.params.username || 'Unicorn';
    const width = Dimensions.get('window').width;

    this.setState({ name, width });
    this.start();

    Dimensions.addEventListener('change', (dimensions) => {
      this.setState({ width: dimensions.window.width });
      this.start();
    });
  }

  start() {
    const unicorns = [];
    for(let index = 1; index <= this.state.size; index++) {
      unicorns.push({ index, duration: this.randomNumber(), key: this.randomId(index), onFinish: () => this.winner() });
    }
    const [first, second] = [...unicorns].sort((a, b) => a.duration - b.duration);
    const winner = first.duration === second.duration
      ? `But it was a draw between 🦄 ${first.index} and ${second.index}` : `🦄 ${first.index} won this race`;

    this.setState({ unicorns, isRunning: false, winner, finished: false, currentTime: 0, initialTime: 0 })
  }

  replay() {
    this.start();
  }

  race() {
    this.state.isRunning ? this.pause() : this.play();
  }

  play() {
    this.setState({ isRunning: true, ...this.getCurrentTime() });
  }

  pause() {
    this.setState({ isRunning: false, ...this.getCurrentTime() });
  }

  winner() {
    this.setState({ isRunning: false, finished: true, ...this.getCurrentTime() });
  }

  getCurrentTime() {
    const date = +(new Date());
    const currentTime = this.state.initialTime === 0 ? 0 : this.state.currentTime + (date - this.state.initialTime);

    return { currentTime, initialTime: date };
  }

  randomId(i) {
    const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const uniqid = randLetter + Date.now() + i;

    return uniqid;
  }

  randomNumber(min = 5, max = 20) {
    return Math.floor((Math.random() * max) + min) * 1000;
  }

  logout() {
    AsyncStorage.removeItem('username');
    this.props.navigation.goBack();
  }

  render() {
    const { name, unicorns, isRunning, winner, finished, currentTime, width } = this.state;
    const winnerText = `${Math.floor(currentTime / 1000)} seconds to find the winner...\n${winner}`;
    const winnerStyle = finished ? [styles.winner, styles.finished] : [styles.winner];
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome {name} to 🦄 paradise!</Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => this.race()}
            text={`${isRunning || finished ? 'PAUSE' : 'PLAY'}`}
            disabled={finished}
            icon={isRunning || finished ? 'pause' : 'play'}
            isFlex
          />
          <Button
            onPress={() => this.replay()}
            text="STOP"
            disabled={!isRunning && !finished}
            icon="redo-alt"
            isFlex
          />
        </View>
        <View style={styles.raceContainer}>
          <Icon name="flag-checkered" size={36} color="black" style={styles.icon} />
          {
            unicorns.map(unicorn => (
              <Unicorn
                {...unicorn}
                isRunning={isRunning}
                duration={unicorn.duration - currentTime}
                width={width}
              />
            ))
          }
        </View>
        <Text style={winnerStyle}>{winnerText}</Text>
        <Button onPress={() => this.logout()} text="Logout" icon="power-off"></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFCAF2',
    padding: 16,
  },
  raceContainer: {
    alignSelf: 'stretch',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '900',
    fontSize: 32,
    flexWrap: 'wrap',
  },
  winner: {
    fontWeight: '700',
    fontSize: 24,
    flexWrap: 'wrap',
    color: 'purple',
    opacity: 0,
  },
  finished: {
    opacity: 1,
  },
  logout: {
    marginRight: 16,
  },
  icon: {
    marginBottom: 4,
  }
});
