import React, { memo, useCallback, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { TextI } from "@/App";

export interface CipheredProps {
  text: TextI;
}

interface CipheredLetter {
  letter: string;
  position: number;
}

function* insertionSort(text: CipheredLetter[]) {
  //Start from the second element.
  for (let i = 1; i < text.length; i++) {
    //Go through the elements behind it.
    for (let j = i - 1; j > -1; j--) {
      //value comparison using ascending order.
      if (text[j + 1].position < text[j].position) {
        //swap
        [text[j + 1], text[j]] = [text[j], text[j + 1]];
      }
    }
    yield text;
  }
}

export const Ciphered = memo(({ text }: CipheredProps) => {
  const [currentText, setCurrentText] = useState<string>("");
  const [generator, setGenerator] = useState<Generator<
    CipheredLetter[]
  > | null>(null);
  const [isDecoded, setIsDecoded] = useState<boolean>(false);

  const buildText = useCallback(
    (text: CipheredLetter[] | undefined) => {
      if (!text) return "";
      return text.map((letter) => letter.letter).join("");
    },
    [currentText],
  );

  useEffect(() => {
    const splitedText = text.text.split("").map((letter, index) => {
      const cipheredLetter: CipheredLetter = {
        letter,
        position: index,
      };
      return cipheredLetter;
    });

    const randomText = splitedText.sort(() => Math.random() - 0.5);
    setCurrentText(buildText(randomText));
    setGenerator(insertionSort(randomText));
  }, [text]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (generator) {
        const generatorText = generator?.next().value;
        setCurrentText(buildText(generatorText));

        if (buildText(generatorText) === text.text) {
          clearInterval(interval);
          setIsDecoded(true);
        }
      }
    }, 10);
    return () => clearInterval(interval);
  }, [generator]);

  if (!currentText?.length) return null;

  return (
    <div className="p-4 flex flex-col gap-4">
      <h3 className="text-xl font-bold">{text.title}</h3>
      <Separator />
      <span
        className={`text-sm w-full  transition-all transition-700 ease-in-out text-muted-foreground ${
          isDecoded ? "opacity-100" : "opacity-40"
        }`}
      >
        {currentText}
      </span>
    </div>
  );
});

Ciphered.displayName = "Ciphered";
