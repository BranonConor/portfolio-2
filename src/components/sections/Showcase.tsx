import { Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { ShowcaseCard } from "../ShowcaseCard";

export const Showcase: React.FC = () => {
  const items: {
    title: string;
    description: string;
    role: string;
    link: string;
    codeLink?: string;
  }[] = [
    {
      title: "Launched ListRocket in Beta! 🚀",
      description:
        "I've launched my web app, ListRocket, a productivity tool for bootstrapping every-day events with friends and family, in beta, fully free! Check it out 👇",
      role: "Software Engineer",
      link: "https://listrocket.app",
      codeLink: "#",
    },
    {
      title: "Co-Created an online HTML/CSS Bootcamp 🎨",
      description:
        "I teamed up with word-class tech instructor, Colt Steele, again to build an HTML/CSS bootcamp for tens of thousands of students!",
      role: "Tech Instructor",
      link: "#",
    },
    {
      title: "Co-Created an online Typescript Course 🎨",
      description:
        "I teamed up with word-class tech instructor, Colt Steele, to help build/launch a Typescript course on Udemy for tens of thousands of students!",
      role: "Tech Instructor",
      link: "#",
    },
    {
      title: "Built a new site for an Optometry Clinic 👀",
      description:
        "I revamped and rebuilt the company website for Bel Vilaggio Eyecare, resulting in 500% more online bookings in just the first month!",
      role: "Web Developer/Designer",
      link: "https://www.belvillaggioeyecare.com/",
    },
    {
      title: "Published an A11y Auditing Article! ✍🏽",
      description:
        "I wrote an article showcasing my work establishing an A11y Auditing program at Color Health, and it was published in the Human Centered design blog!",
      role: "Design Technologist",
      link: "https://medium.com/color-research-design/we-used-ux-research-after-an-accessibility-audit-heres-what-happened-e84ac05ae20a",
    },
    {
      title: "Spoke to SDSU Design students! 🧠",
      description:
        "SDSU + Friends of Figma, SD were kind enough to have me on as a panelist to share my experience breaking into tech through an unorthodox career path.",
      role: "Design Tech. Panelist",
      link: "https://www.youtube.com/watch?v=MdwRX0MwtFE&ab_channel=FriendsofFigma%2CSanDiego",
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
        Showcase
      </Heading>
      <Text as="p" mb={8}>
        Here's some recent accomplishments, engagements, updates, and more!
      </Text>
      <Grid
        gridGap={4}
        gridTemplateColumns={[
          "1fr",
          "1fr",
          "1fr 1fr ",
          "1fr 1fr",
          "repeat(3, 1fr)",
        ]}
      >
        {items.map((item) => (
          <ShowcaseCard
            title={item.title}
            description={item.description}
            link={item.link}
            codeLink={item?.codeLink}
            role={item.role}
          />
        ))}
      </Grid>
    </Flex>
  );
};
