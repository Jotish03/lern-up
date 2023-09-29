// components/OnBoarding.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Animated,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import OnBoardData from "../constants/OnBoardData";
import Paginator from "./Paginator";
import OnBoardingItem from "./OnBoardingItem";
import NextButton from "./NextButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnBoarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const OnBoardDataRef = useRef(null);

  const navigation = useNavigation();

  const scrollTo = async () => {
    if (currentIndex < OnBoardData.length - 1) {
      OnBoardDataRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await AsyncStorage.setItem("@viewedOnboarding", "true");
        navigation.navigate("UserLogin");
      } catch (error) {
        console.log("Error @setItem", error);
      }
    }
  };

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const value = await AsyncStorage.getItem("@viewedOnboarding");

        if (value !== null) {
          navigation.navigate("UserLogin");
        }
      } catch (error) {
        console.log("Error @checkOnboarding:", error);
      }
    }

    checkOnboarding();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={OnBoardData}
          renderItem={({ item }) => <OnBoardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={OnBoardDataRef}
        />
        <Paginator data={OnBoardData} scrollX={scrollX} />
        <NextButton
          scrollTo={scrollTo}
          percentage={(currentIndex + 1) * (100 / OnBoardData.length)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Set background color to white
  },
});

export default OnBoarding;
