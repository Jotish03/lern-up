// CustomTransition.js
import { Easing, Animated } from "react-native";

export const slideInTransition = ({ current }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [400, 0], // Slide in from the right
            extrapolate: "clamp",
          }),
        },
      ],
    },
  };
};

export const transitionConfig = {
  transitionSpec: {
    open: {
      animation: "timing",
      config: { duration: 300, easing: Easing.inOut(Easing.ease) },
    },
    close: {
      animation: "timing",
      config: { duration: 300, easing: Easing.inOut(Easing.ease) },
    },
  },
  screenInterpolator: slideInTransition,
};
