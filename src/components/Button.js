import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

type Props = {
  text: string,
  disabled: boolean,
  onPress: Function,
  icon?: string,
  isFlex: boolean,
};

export default class Button extends Component<Props> {

  render() {
    const { text, disabled, icon, onPress, isFlex } = this.props;
    const stylesContainer = disabled ? [styles.container, styles.disabled] : [styles.container];

    if (isFlex) stylesContainer.push(styles.flex);

    return (
      <TouchableHighlight
        style={stylesContainer}
        disabled={disabled}
        onPress={() => onPress()}
      >
        <View style={styles.view}>
          { icon ? <Icon name={icon} size={16} color="white" style={styles.icon}/> : null }
          <Text style={styles.text}>{text}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'purple',
    padding: 16,
    borderRadius: 8,
    margin: 8,
  },
  icon: {
    marginRight: 16,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  flex: {
    flex: 1,
  }
});
