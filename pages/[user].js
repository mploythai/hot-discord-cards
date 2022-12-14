import { Skeleton, useMediaQuery } from "@chakra-ui/react";
import { useSession } from "@supabase/auth-helpers-react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Page from "../components/general/page";
import SignInPrompt from "../components/general/sign-in-prompt";
import Profile from "../components/profile";
import ProfileCard from "../components/profile/card";
import CardGrid from "../components/profile/card-grid";
import Card from "../components/profile/card-grid/card";
import getUserData from "../utils/get-user-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(url, key);

export default function User({ user, card }) {
  const session = useSession();
  const route = useRouter();
  const { userData } = getUserData();
  const [notLandscape] = useMediaQuery("(min-height: 480px)");

  useEffect(() => {
    if (user.username === userData.username) route.push("/");
  });

  return (
    <Page
      title={user.username}
      maxH={!session ? (notLandscape ? "100vh" : "150vh") : null}
      overflow={!session ? "hidden" : null}
    >
      {!session ? <SignInPrompt /> : null}
      <Profile>
        <ProfileCard userData={user} display="none" />
        <CardGrid word={`${user.username}'s`}>
          {card.map((card) => {
            return (
              <Skeleton key={card.id} rounded="md" isLoaded={card}>
                <Card cardData={card} userData={userData} pageType="public" />
              </Skeleton>
            );
          })}
        </CardGrid>
      </Profile>
    </Page>
  );
}

export async function getStaticProps({ params }) {
  let user = {};
  let card = [];

  let { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params["user"])
    .single();

  if (data) {
    Object.assign(user, data);

    let { data: cards } = await supabase
      .from("cards")
      .select("*, owners!inner (*)")
      .eq("owners.user_id", data.id);
    card = [...cards];
  }

  return {
    props: {
      user: user,
      card: card,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  let { data } = await supabase.from("profiles").select("username");

  return {
    paths: data.map((data) => {
      return {
        params: {
          user: data.username,
        },
      };
    }),
    fallback: "blocking",
  };
}
