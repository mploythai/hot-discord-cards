import {
  Button,
  HStack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "../../utils/supabase-client";

export default function OverlayFooter({
  base,
  md,
  w,
  justify,
  buy,
  gap,
  onClose,
  id,
  getCardData,
  own,
  reset,
}) {
  const toast = useToast();
  const toastPos = useBreakpointValue(["bottom", "bottom-right"]);
  const toastW = useBreakpointValue(["100%", "320px"]);
  const toastP = useBreakpointValue(["0 16px 8px", "0 8px 8px"]);

  async function deleteCard(id) {
    try {
      let { error } = await supabase
        .from("owners")
        .delete()
        .match({ card_id: id });

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error!",
        description: error.message,
        status: "error",
        position: toastPos,
        containerStyle: {
          w: toastW,
          p: toastP,
        },
        isClosable: true,
      });
    } finally {
      getCardData();

      toast({
        title: "Success!",
        description: "The card was deleted.",
        status: "success",
        position: toastPos,
        containerStyle: {
          w: toastW,
          p: toastP,
        },
        isClosable: true,
      });
    }
  }

  return (
    <HStack display={[base, md]} w={w} justify={justify} gap={gap}>
      {!buy ? (
        <>
          <Button
            variant="ghost"
            colorScheme="red"
            rounded="lg"
            onClick={() => deleteCard(id)}
          >
            Delete
          </Button>

          <Button colorScheme="purple" rounded="lg" isDisabled>
            Trade
          </Button>
        </>
      ) : (
        <>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="red.500"
            opacity={own ? 1 : 0}
            transition=".25s ease-in-out"
          >
            You already own this card!
          </Text>

          <Button
            colorScheme="purple"
            onClick={onClose}
            onClickCapture={() => reset(false)}
          >
            Continue
          </Button>
        </>
      )}
    </HStack>
  );
}
