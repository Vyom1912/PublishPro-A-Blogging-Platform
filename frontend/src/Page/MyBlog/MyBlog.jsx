import React from "react";
import { Card } from "../../components";
function MyBlog() {
  return (
    <div>
      <div className='profile-data-box'>
        <Card
          id='1'
          title='website analytics'
          imgSrc='https://picsum.photos/300/200'
        />
        <Card id='2' title='My Blogs' imgSrc='https://picsum.photos/300/200' />

        <Card
          id='3'
          title='website analytics'
          imgSrc='https://picsum.photos/300/200'
        />
      </div>
    </div>
  );
}

export default MyBlog;
