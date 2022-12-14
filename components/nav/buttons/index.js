import {
  Button,
  HStack,
  IconButton,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "@supabase/auth-helpers-react";
import { useRef } from "react";
import { FaBars } from "react-icons/fa";
import NavLinks from "./links";
import MobileMenu from "./mobile";

export default function NavButtons() {
  const session = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <>
      {!session ? (
        <Link
          href="https://github.com/mploythai/hot-discord-cards"
          _hover={{ textDecor: "none" }}
          isExternal
        >
          <Button size="sm" variant="ghost">
            Source Code
          </Button>
        </Link>
      ) : (
        <>
          <HStack display={{ base: "none", md: "flex" }}>
            <NavLinks size="sm" />
          </HStack>

          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<FaBars />}
            onClick={onOpen}
          />

          <MobileMenu isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
        </>
      )}
    </>
  );
}
