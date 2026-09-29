import { FaArrowRight } from "react-icons/fa6";
import { thumbUrl } from "../../utils/image";
import "./Card.css";

function Card({ title, imgSrc, description, author }) {
  return (
    <div className='card flex'>
      <div className='card-img'>
        {imgSrc ? (
          <img
            src={thumbUrl(imgSrc)}
            alt=''
            width='100'
            height='100'
            loading='lazy'
            decoding='async'
          />
        ) : (
          <div className='card-img-empty' />
        )}
      </div>
      <div className='card-info flex'>
        <h3 className='flex'>
          <span className='card-title'>{title}</span>
          <FaArrowRight className='card-icone' aria-hidden='true' />
        </h3>

        {author && <span className='card-author'>by {author}</span>}

        <p className='description-content'>{description}</p>
      </div>
    </div>
  );
}

// Same shape as a card, shown while the list is loading
export function CardSkeleton() {
  return (
    <div className='card-link card-skeleton' aria-hidden='true'>
      <div className='card flex'>
        <div className='card-img'>
          <div className='skeleton skeleton-img' />
        </div>
        <div className='card-info flex'>
          <div className='skeleton skeleton-line' />
          <div className='skeleton skeleton-line short' />
        </div>
      </div>
    </div>
  );
}

export default Card;
