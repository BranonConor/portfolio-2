import { Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { PostCard } from "../blog/PostCard";
export const Music = () => {
  const items: {
    title: string;
    link: string;
    date: string;
    image: string;
    category: string;
  }[] = [
    {
      title: "Adobo Tapes",
      image: "/adobo-tapes.png",
      date: "2024",
      link: "https://open.spotify.com/album/1VwNNoVc3fJFH45PQ7yqTK?si=mnPFB9RHSaWKzikZa1SB7w",
      category: "Hip hop Beats",
    },
    {
      title: "OVER THE YEARS",
      image: "/over-the-years.png",
      date: "2023",
      link: "https://open.spotify.com/album/3sTnhMmZkSWRqwOjUd61Q8",
      category: "Hip hop Beats",
    },
    {
      title: "Vancouver Loft",
      image: "/vancouver-loft.png",
      date: "2022",
      link: "https://open.spotify.com/album/0jgqurG0HxAJipHhhxrgwg?si=3UnMP0ZEQtSyg4oA4Mb4aw",
      category: "Hip hop Beats",
    },
    {
      title: "FEEL SOMETHING TAPES",
      image: "/feel-something-tapes.png",
      date: "2021",
      link: "https://open.spotify.com/album/2Sd57YRcNyJDEEH4tyfBRb?si=PXu62aKAT--jt8-azOxXbg",
      category: "Hip hop Beats",
    },
  ];
  return (
    <Flex
      bg="brand.gradient"
      width="100%"
      padding={4}
      marginY={[8, 10, 12]}
      borderRadius={8}
      color="white"
      flexDirection="column"
    >
      <Heading as="h3" size="xl" fontWeight={700} mb={2}>
        Music Production
      </Heading>
      <Text as="p" mb={8}>
        I've been producing hip hop beats since I was in high school - over a
        decade. I recently released my 3rd beat tape album on Spotify under my
        producer name, @PancitPapi (a hearken to my Filipino heritage). Check it
        out, alongside past albums!
      </Text>
      <Grid
        gridGap={4}
        gridTemplateColumns={["1fr", "1fr", "1fr 1fr ", "1fr 1fr", "1fr 1fr"]}
      >
        {items.map((item) => (
          <PostCard
            title={item.title}
            category={item.category}
            date={item.date}
            link={item.link}
            image={item.image}
            useSecondaryButton
            useExternalLink
            buttonText="Listen"
            hoverIcon="🎧"
          />
        ))}
      </Grid>
    </Flex>
  );
};
