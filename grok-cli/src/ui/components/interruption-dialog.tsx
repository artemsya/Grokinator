import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import { exec } from "child_process";

interface InterruptionDialogProps {
  score: number;
  reason: string;
  relevantMessages?: any[];
  onContinue: (skipFuturePrompts?: boolean) => void;
  onStop: () => void;
}

export default function InterruptionDialog({
  score,
  reason,
  relevantMessages = [],
  onContinue,
  onStop,
}: InterruptionDialogProps) {
  const [selectedOption, setSelectedOption] = useState(0);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [blinkState, setBlinkState] = useState(true);

  // Blinking effect for alert status
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkState((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);


  const options = [
    "● STOP OPERATION",
    "● CONTINUE ANYWAY",
    "● SKIP WARNINGS",
  ];

  // Generate warning bars
  const warningBar = "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓";
  const statusText = `AGENT STATUS: ${blinkState ? "⚠ ALERT DETECTED ⚠" : "                    "}`;

  useInput((input, key) => {
    if (feedbackMode) {
      return;
    }

    if (key.upArrow || (key.shift && key.tab)) {
      setSelectedOption((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      return;
    }

    if (key.downArrow || key.tab) {
      setSelectedOption((prev) => (prev + 1) % options.length);
      return;
    }

    if (key.return) {
      if (selectedOption === 0) {
        onStop();
      } else if (selectedOption === 1) {
        onContinue(false);
      } else if (selectedOption === 2) {
        onContinue(true);
      }
      return;
    }

    if (key.escape) {
      // Escape stops the agent
      onStop();
      return;
    }
  });

  // Format the reason - it comes as a multi-line string with scores
  const reasonLines = reason.split("\n").slice(0, 3); // Show first 3 lines

  return (
    <Box flexDirection="column" width="100%" height="84%">
      {/* Red Box 1 */}
      <Box
        borderStyle="round"
        borderColor="red"
        flexDirection="column"
        width="100%"
        height="100%"
        paddingX={1}
        paddingY={1}
      >
        {/* Red Box 2 */}
        <Box
          borderStyle="round"
          borderColor="red"
          flexDirection="column"
          width="100%"
          height="100%"
          paddingX={1}
          paddingY={1}
        >
          {/* Red Box 3 */}
          <Box
            borderStyle="round"
            borderColor="red"
            flexDirection="column"
            width="100%"
            height="100%"
            paddingX={1}
            paddingY={1}
          >
            {/* Red Box 4 */}
            <Box
              borderStyle="round"
              borderColor="red"
              flexDirection="column"
              width="100%"
              height="100%"
              paddingX={1}
              paddingY={1}
            >
              {/* Red Box 5 - Content inside */}
              <Box
                borderStyle="round"
                borderColor="red"
                flexDirection="column"
                width="100%"
                height="100%"
                paddingX={2}
                paddingY={1}
              >
                {/* Top warning bar */}
                <Box marginBottom={1}>
                  <Text color="red" backgroundColor="black">
                    {warningBar}
                  </Text>
                </Box>

                {/* Blinking status */}
                <Box justifyContent="center" marginBottom={2}>
                  <Text color="red" backgroundColor="black">
                    {statusText}
                  </Text>
                </Box>

                {/* Health Score - Large and prominent */}
                <Box justifyContent="center" marginBottom={2}>
                  <Box flexDirection="column" alignItems="center">
                    <Text color="red">HEALTH SCORE</Text>
                    <Text color="red" bold>
                      {score}/15
                    </Text>
                  </Box>
                </Box>

                {/* Analysis section - no truncation */}
                <Box flexDirection="column" alignItems="center" marginBottom={3}>
                  <Text color="red">ANALYSIS DATA</Text>
                  <Box marginTop={1} flexDirection="column" alignItems="center">
                    {reasonLines.slice(0, 2).map((line, idx) => (
                      <Text key={idx} color="white" dimColor wrap="truncate-end">
                        {line}
                      </Text>
                    ))}
                  </Box>
                </Box>

                {/* Messages reviewed */}
                <Box justifyContent="center" marginBottom={3}>
                  <Text color="yellow">
                    ◄ {relevantMessages?.length || 0} MESSAGES ANALYZED ►
                  </Text>
                </Box>

                {/* Decision options - styled like menu */}
                <Box flexDirection="column" alignItems="center" marginBottom={3}>
                  <Text color="red">SYSTEM PROMPT</Text>
                  <Box marginTop={2} flexDirection="column" alignItems="center">
                    {options.map((option, index) => (
                      <Box
                        key={index}
                        marginBottom={1}
                        paddingX={selectedOption === index ? 2 : 1}
                        borderStyle={selectedOption === index ? "round" : undefined}
                        borderColor={selectedOption === index ? "red" : undefined}
                      >
                        <Text
                          color={selectedOption === index ? "black" : "white"}
                          backgroundColor={selectedOption === index ? "red" : undefined}
                        >
                          {option}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Controls */}
                <Box justifyContent="center" marginBottom={1}>
                  <Text color="cyan">↑↓ SELECT │ ENTER CONFIRM │ ESC ABORT</Text>
                </Box>

                {/* Bottom warning bar */}
                <Box>
                  <Text color="red" backgroundColor="black">
                    {warningBar}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
