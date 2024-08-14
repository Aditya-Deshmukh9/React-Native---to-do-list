import { Entypo } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Button } from "react-native";
import { Audio } from "expo-av";
import winSound from "../assets/winSound.mp3";
import LottieView from "lottie-react-native";
import winanimation from "../assets/winanimation.json";

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [sound, setSound] = useState(null);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(winSound);
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handlePress = (index) => {
    if (board[index] || winner) return;
    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
    calculateWinner(newBoard);
  };

  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        playSound();
        return;
      }
    }
    if (!board.includes(null)) {
      setWinner("Draw");
    }
  };

  const renderSquare = (index) => {
    return (
      <TouchableOpacity
        key={index}
        className="w-1/3 h-24 justify-center items-center border border-white"
        onPress={() => handlePress(index)}
      >
        <Text className="text-6xl">
          {board[index] === "X" && (
            <Entypo name="cross" size={60} color="black" />
          )}
          {board[index] === "O" && (
            <Entypo name="circle" size={60} color="black" />
          )}
        </Text>
      </TouchableOpacity>
    );
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <View className="flex-1 justify-center items-center bg-red-100">
      <Text className="text-4xl font-bold mb-5 absolute top-14">
        Tic-Tac-Toe
      </Text>
      {winner && (
        <View className="absolute top-32 items-center">
          <Text className="text-2xl my-5">
            {winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}
          </Text>
          {winner !== "Draw" && (
            <LottieView
              source={winanimation}
              autoPlay
              loop={true}
              className="h-52 w-52 z-50"
            />
          )}
        </View>
      )}
      <View className="w-11/12 flex-row flex-wrap justify-center bg-white border rounded-xl border-dashed border-red-500">
        <View className="w-[95%] flex-row flex-wrap m-1 bg-red-500 rounded-xl">
          {Array(9)
            .fill(null)
            .map((_, index) => renderSquare(index))}
        </View>
      </View>
      <Button title="Reset Game" onPress={resetGame} />
    </View>
  );
};

export default App;
