import api from "../../api/axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserOverview from "../../components/UserOverview/UserOverview";
import "./AuthorProfile.css";

const EMPTY_STATS = { totalBlogs: 0, totalLikes: 0, totalViews: 0, totalSaves: 0 };

function AuthorProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;

    api
      .get(`/blogs/author/${id}`)
      .then((res) => !ignore && setData(res.data))
      .catch((error) => {
        if (!ignore && error.response?.status === 404) setNotFound(true);
        console.error(error);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (notFound) {
    return (
      <div className='containerBox status-page'>
        <h1>Author not found</h1>
        <p>This account may have been removed.</p>
        <Link to='/' className='inputBtn'>
          Browse blogs
        </Link>
      </div>
    );
  }

  return (
    <div className='containerBox author-page'>
      {data ? (
        <UserOverview
          author={data.author}
          stats={data.stats}
          blogs={data.blogs}
          isOwner={false}
        />
      ) : (
        <UserOverview author={{}} stats={EMPTY_STATS} isOwner={false} loading />
      )}
    </div>
  );
}

// Fresh state for each author (e.g. when following links between authors)
function AuthorProfilePage() {
  const { id } = useParams();
  return <AuthorProfile key={id} />;
}

export default AuthorProfilePage;
