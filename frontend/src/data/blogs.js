// src/data/blogs.js

const blogs = [
  {
    id: 1,
    title: "Website Analytics",
    image: "https://picsum.photos/300/200",
    content: `The usual React Router approach is:
                Create a route for a single blog page.
                Make the card clickable.
                Pass the blog ID in the URL.
                Load/display the correct blog on the details page.`,
    author: "Hello Patel",
    authorId: "124",
  },
  {
    id: 2,
    title: "React Basics",
    image: "https://picsum.photos/300/200",
    content:
      "Yes. For the frontend mockup stage, that's actually a very good approach. Create a separate file that contains all your blog data and import it wherever needed.",
    author: "Vyom Patel",
    authorId: "123",
  },
  {
    id: 3,
    title: "Node.js and Express",
    image: "https://picsum.photos/300/200",
    content:
      "Since you're planning to add a Node.js/Express + MongoDB backend later, the best approach is not to pass the entire user object through React Router state.",
    author: "Vyom Patel",
    authorId: "123",
  },
  {
    id: 4,
    title: "MongoDB Fundamentals",
    image: "https://picsum.photos/300/200",
    content:
      "MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents.",
    author: "Vyom Patel",
    authorId: "123",
  },
];

export default blogs;
