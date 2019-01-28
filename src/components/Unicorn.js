import React, {Component} from 'react';
import {Animated, StyleSheet, View, Image} from 'react-native';

type Props = {
  duration: number,
  index: number,
  isRunning: boolean,
  onFinish: any,
  width: number,
}
export default class Unicorn extends Component<Props> {
  animation = {
    transformAnim: new Animated.Value(0),
    ref: undefined,
    image: require('../images/unicorn.png'),
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isRunning !== undefined) {
      nextProps.isRunning ? this.play() : this.stop();
    }
  }

  createAnimation(duration) {
    this.animation.ref = Animated.timing(
      this.animation.transformAnim,
      {
        toValue: 1,
        duration,
      }
    );
  }

  play() {
    this.createAnimation(this.props.duration);
    this.animation.ref.start(() => {
      if (this.animation.transformAnim._value === 1) {
        this.props.onFinish();
      }
    });
  }

  stop() {
    this.animation.ref.stop();
  }

  calculateWidth(width) {
    return (width - 72) * -1;
  }

  render() {
    let { transformAnim } = this.animation;
    let { width } = this.props;

    if (!width) return null;

    width = this.calculateWidth(width);
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            ...styles.box,
            transform: [{
              translateX: transformAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width]
              }),
            }],
          }}>
            <Image source={this.animation.image} style={{width: 36, height: 36}}/>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    backgroundColor: '#F5FCFF',
    borderColor: 'pink',
    borderWidth: 1
  },
  box: {
    width: 36,
    height: 36,
    justifyContent: 'flex-end',
  },
});
