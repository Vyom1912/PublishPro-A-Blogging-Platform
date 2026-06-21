import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BackButton, UserOverview } from "../../components";
import "./AuthorProfile.css";

function AuthorProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await api.get(`/blogs/author/${id}`);
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAuthor();
  }, [id]);

  if (!data) return <p className='author-loading'>Loading...</p>;

  const { author, blogs, stats } = data;

  return (
    <div className='containerBox'>
      <BackButton />
      <UserOverview
        author={author}
        stats={stats}
        blogs={blogs}
        isOwner={false}
      />
    </div>
  );
}

export default AuthorProfile;
