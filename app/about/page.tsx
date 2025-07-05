import Image from "next/image";
import NavBar from "../../components/General/NavBar";
import AboutIntro from "../../components/About/AboutIntro";
import TopicSegment from "../../components/About/TopicSegment";
import Footer from "../../components/General/Footer";

const topics = [
  // {
  //   id: 1,
  //   title: "Coding",
  //   description: "I almost always have a personal programming project in the works (if not two or three). I've explored many different fields of development from web development, game development, embedded systems, and more, and have loved every second of it.",
  //   image: ["/images/about/coding.png"],
  //   leftOrRight: false,
  //   link: "https://www.chess.com/member/0xef",
  //   linkTitle: "Check out my GitHub"
  // },
  {
    id: 2,
    title: "Gym (Powerlifting)",
    description: "I've been in gyms since I was very young, but I really started to get consistent and take it seriously back in 2022. Since then I've gone through many different phases in my training, but in mid-late 2024 I started powerlifting and fell in love with it. Shown below are some pictures of my current PRs, a 335 squat, 295 bench, and 455 deadlift.",
    image: ["/images/about/squat.jpg", "/images/about/bench.jpg", "/images/about/deadlift.jpg"],
    leftOrRight: null,
    link: "https://www.instagram.com/oats_lifts/",
    linkTitle: "Check out my powerlifting account"
  },
  {
    id: 3,
    title: "Chess",
    description: "In 2023, I lived and breathed chess. All of my free time went to playing games, solving puzzles, or reading theory (you can see dinky, the neighborhood cat, studying the Giuoco Piano opening with me). While I don't play quite as much as I used to, when I have time I still love to play a couple bullet games here and there.",
    image: ["/images/about/chess.jpg"],
    leftOrRight: true,
    link: "https://www.chess.com/member/0xef",
    linkTitle: "Add me on chess.com"
  },
  {
    id: 5,
    title: "Student Organizations",
    description: "Despite only having been at UTD for two semesters so far, I made it my mission to be as active on campus as possible. As a result, I've met some great people, made some cool things, and contributed to making the UTD computer science program a great one. I hold officer positions for ACM and GDSC, and membership status in the powerlifting club and Nebula Labs.",
    image: ["/images/about/org1.jpg", "/images/about/org2.jpg"],
    leftOrRight: null,
  },
  {
    id: 4,
    title: "Cats",
    description: "I've lived with cats most of my life and love spending time with them. Here's Luther, a cat we adopted when I was 5 (which I named after the show Zeke and Luther), and he's been one of my best friends since I can remember.",
    image: ["/images/about/luther.jpg"],
    leftOrRight: false,
  },
  
  
];

export default function About() {
  return (
    <>
      <NavBar />
      <main>
        <AboutIntro />
        {topics.map(topic => (
          <TopicSegment key={topic.id} {...topic} />
        ))}
      </main>
      <Footer />
    </>
  );
}
