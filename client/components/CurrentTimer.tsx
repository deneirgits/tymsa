import React, { useCallback } from "react";
import { Text, View, ListRenderItem } from "react-native";

import ActionSheet, { FlatList } from "react-native-actions-sheet";

function AlwaysOpen() {
  const timers = [
    "🍅 Tomato",
    "🥕 Carrot",
    "🥦 Broccoli",
    "🥒 Cucumber",
    "🌶️ Hot Pepper",
    "🫑 Bell Pepper",
    "🧄 Garlic",
    "🧅 Onion",
    "🍄 Mushroom",
    "🥔 Potato",
    "🥬 Leafy Green",
    "🥑 Avocado",
    "🍆 Eggplant",
    "🥝 Kiwi Fruit",
    "🍓 Strawberry",
    "🍈 Melon",
    "🍒 Cherries",
    "🍑 Peach",
    "🍍 Pineapple",
    "🥭 Mango",
    "🍉 Watermelon",
    "🍌 Banana",
    "🍋 Lemon",
    "🍊 Orange",
    "🍎 Red Apple",
    "🍏 Green Apple",
    "🍐 Pear",
    "🍇 Grapes",
  ];

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item }) => (
      <Text
        style={{
          color: "black",
          fontSize: 20,
          height: 40,
          verticalAlign: "middle",
          width: "100%",
        }}
      >
        {item}
      </Text>
    ),
    [],
  );
  return (
    <ActionSheet
      isModal={false}
      backgroundInteractionEnabled
      snapPoints={[10, 100]}
      gestureEnabled
      closable={false}
      disableDragBeyondMinimumSnapPoint
      containerStyle={{
        borderWidth: 1,
        borderColor: "#f0f0f0",
      }}
    >
      <View className="px-4 py-2 items-center">
        <Text className="text-black w-full text-3xl font-semibold">
          Vegetables
        </Text>
      </View>
      <View className="px-4 py-2 items-center">
        <FlatList
          className="w-full mb-10"
          data={timers}
          keyExtractor={(item, index) => item + index}
          renderItem={renderItem}
        />
      </View>
    </ActionSheet>
  );
}

export default AlwaysOpen;
